import React, { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Save,
  WifiOff,
} from "lucide-react";

import {
  createHealthRecord,
  fetchHealthRecords,
} from "../../redux/slices/healthRecordSlice";

import {
  getOfflineBeneficiaries,
} from "../../offline/beneficiaryOfflineService";

import {
  getOfflineVisits,
} from "../../offline/visitOfflineService";

const CreateOfflineHealthRecord = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const queryBeneficiaryId =
    searchParams.get("beneficiaryId");

  const queryVisitId =
    searchParams.get("visitId");

  const { user } = useSelector(
    (state) => state.auth
  );

  const {
    healthRecords = [],
    actionLoading = false,
    actionError = null,
  } = useSelector(
    (state) => state.healthRecords
  );

  const [beneficiaries, setBeneficiaries] =
    useState([]);

  const [visits, setVisits] =
    useState([]);

  const [loadingData, setLoadingData] =
    useState(true);

  const [error, setError] =
    useState("");

  const [formData, setFormData] =
    useState({
      beneficiaryId:
        queryBeneficiaryId || "",

      visitId:
        queryVisitId || "",

      bloodPressure: "",
      weight: "",
      temperature: "",
      hemoglobin: "",
      diagnosis: "",
      prescription: "",
      notes: "",
    });

  /* =====================================================
     LOAD OFFLINE DATA
  ===================================================== */

  useEffect(() => {
    const loadOfflineData =
      async () => {
        try {
          setLoadingData(true);
          setError("");

          if (!user?.id) {
            setError(
              "ASHA user information is not available."
            );
            return;
          }

          const [
            offlineBeneficiaries,
            offlineVisits,
          ] = await Promise.all([
            getOfflineBeneficiaries(
              user.id
            ),

            getOfflineVisits(
              user.id
            ),
          ]);

          const safeBeneficiaries =
            Array.isArray(
              offlineBeneficiaries
            )
              ? offlineBeneficiaries
              : [];

          const safeVisits =
            Array.isArray(
              offlineVisits
            )
              ? offlineVisits
              : [];

          /*
           * Keep only beneficiaries assigned
           * to the logged-in ASHA.
           */
          const ownedBeneficiaries =
            safeBeneficiaries.filter(
              (beneficiary) =>
                beneficiary.ashaId ===
                user.id
            );

          /*
           * getOfflineVisits(user.id)
           * already filters by ASHA, but we
           * validate again for safety.
           */
          const ownedVisits =
            safeVisits.filter(
              (visit) =>
                !visit.ashaId ||
                visit.ashaId ===
                  user.id
            );

          setBeneficiaries(
            ownedBeneficiaries
          );

          setVisits(
            ownedVisits
          );

          /*
           * If a beneficiary was passed
           * through URL, verify ownership.
           */
          if (
            queryBeneficiaryId
          ) {
            const beneficiary =
              ownedBeneficiaries.find(
                (item) =>
                  item.id ===
                  queryBeneficiaryId
              );

            if (!beneficiary) {
              setError(
                "Selected beneficiary is not assigned to the logged-in ASHA."
              );

              setFormData(
                (prev) => ({
                  ...prev,
                  beneficiaryId: "",
                  visitId: "",
                })
              );
            }
          }

          /*
           * If a visit was passed through URL,
           * verify:
           *
           * 1. Visit exists
           * 2. Visit belongs to ASHA
           * 3. Visit is not deleted
           * 4. Beneficiary belongs to ASHA
           */
          if (queryVisitId) {
            const selectedVisit =
              ownedVisits.find(
                (visit) =>
                  visit.id ===
                  queryVisitId
              );

            if (!selectedVisit) {
              setError(
                "Selected visit was not found offline or does not belong to the logged-in ASHA."
              );

              setFormData(
                (prev) => ({
                  ...prev,
                  visitId: "",
                })
              );
            } else if (
              selectedVisit.syncStatus ===
              "PENDING_DELETE"
            ) {
              setError(
                "Selected visit is pending deletion and cannot have a health record."
              );

              setFormData(
                (prev) => ({
                  ...prev,
                  visitId: "",
                })
              );
            } else {
              const beneficiary =
                ownedBeneficiaries.find(
                  (item) =>
                    item.id ===
                    selectedVisit.beneficiaryId
                );

              if (!beneficiary) {
                setError(
                  "The beneficiary associated with this visit is not assigned to the logged-in ASHA."
                );

                setFormData(
                  (prev) => ({
                    ...prev,
                    beneficiaryId: "",
                    visitId: "",
                  })
                );
              } else {
                setFormData(
                  (prev) => ({
                    ...prev,

                    beneficiaryId:
                      selectedVisit.beneficiaryId,

                    visitId:
                      selectedVisit.id,
                  })
                );
              }
            }
          }
        } catch (err) {
          console.error(
            "Failed to load offline health record data:",
            err
          );

          setError(
            "Failed to load offline data."
          );
        } finally {
          setLoadingData(false);
        }
      };

    loadOfflineData();
  }, [
    user?.id,
    queryBeneficiaryId,
    queryVisitId,
  ]);

  /* =====================================================
     LOAD EXISTING HEALTH RECORDS
  ===================================================== */

  useEffect(() => {
    if (user?.id) {
      dispatch(
        fetchHealthRecords()
      );
    }
  }, [
    dispatch,
    user?.id,
  ]);

  /* =====================================================
     FILTER VISITS
  ===================================================== */

  const allSelectedBeneficiaryVisits =
    useMemo(() => {
      if (
        !formData.beneficiaryId
      ) {
        return [];
      }

      return visits.filter(
        (visit) =>
          visit.beneficiaryId ===
            formData.beneficiaryId &&
          visit.syncStatus !==
            "PENDING_DELETE" &&
          (!visit.ashaId ||
            visit.ashaId ===
              user?.id)
      );
    }, [
      visits,
      formData.beneficiaryId,
      user?.id,
    ]);

  /*
   * Only visits without an existing
   * health record can be selected.
   */
  const selectedBeneficiaryVisits =
    useMemo(() => {
      return allSelectedBeneficiaryVisits.filter(
        (visit) =>
          !healthRecords.some(
            (record) =>
              record.visitId ===
                visit.id &&
              record.syncStatus !==
                "PENDING_DELETE"
          )
      );
    }, [
      allSelectedBeneficiaryVisits,
      healthRecords,
    ]);

  /* =====================================================
     HANDLE CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setError("");

    if (
      name ===
      "beneficiaryId"
    ) {
      setFormData(
        (prev) => ({
          ...prev,

          beneficiaryId:
            value,

          visitId: "",
        })
      );

      return;
    }

    setFormData(
      (prev) => ({
        ...prev,

        [name]: value,
      })
    );
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateForm = () => {
    if (!user?.id) {
      return "ASHA user information is not available.";
    }

    if (
      !formData.beneficiaryId
    ) {
      return "Please select a beneficiary.";
    }

    /*
     * Verify beneficiary belongs
     * to logged-in ASHA.
     */
    const selectedBeneficiary =
      beneficiaries.find(
        (beneficiary) =>
          beneficiary.id ===
          formData.beneficiaryId
      );

    if (!selectedBeneficiary) {
      return "Selected beneficiary is not available offline.";
    }

    if (
      selectedBeneficiary.ashaId !==
      user.id
    ) {
      return "This beneficiary is not assigned to the logged-in ASHA.";
    }

    if (!formData.visitId) {
      return "Please select a visit.";
    }

    /*
     * Find selected visit.
     */
    const selectedVisit =
      visits.find(
        (visit) =>
          visit.id ===
          formData.visitId
      );

    if (!selectedVisit) {
      return "Selected visit was not found offline.";
    }

    /*
     * Verify visit ownership.
     */
    if (
      selectedVisit.ashaId &&
      selectedVisit.ashaId !==
        user.id
    ) {
      return "This visit does not belong to the logged-in ASHA.";
    }

    /*
     * Verify beneficiary relationship.
     */
    if (
      selectedVisit.beneficiaryId !==
      formData.beneficiaryId
    ) {
      return "Selected visit does not belong to the selected beneficiary.";
    }

    /*
     * Deleted visits cannot receive
     * a health record.
     */
    if (
      selectedVisit.syncStatus ===
      "PENDING_DELETE"
    ) {
      return "This visit has been deleted and cannot have a health record.";
    }

    /*
     * Check duplicate health record.
     */
    const existingRecord =
      healthRecords.some(
        (record) =>
          record.visitId ===
            formData.visitId &&
          record.syncStatus !==
            "PENDING_DELETE"
      );

    if (existingRecord) {
      return "A health record already exists for this visit.";
    }

    /* =============================================
       WEIGHT
    ============================================= */

    if (
      formData.weight !==
      ""
    ) {
      const weight =
        Number(
          formData.weight
        );

      if (
        Number.isNaN(
          weight
        ) ||
        weight < 1 ||
        weight > 300
      ) {
        return "Weight must be between 1 and 300 kg.";
      }
    }

    /* =============================================
       TEMPERATURE
    ============================================= */

    if (
      formData.temperature !==
      ""
    ) {
      const temperature =
        Number(
          formData.temperature
        );

      if (
        Number.isNaN(
          temperature
        ) ||
        temperature < 30 ||
        temperature > 45
      ) {
        return "Temperature must be between 30 and 45 °C.";
      }
    }

    /* =============================================
       HEMOGLOBIN
    ============================================= */

    if (
      formData.hemoglobin !==
      ""
    ) {
      const hemoglobin =
        Number(
          formData.hemoglobin
        );

      if (
        Number.isNaN(
          hemoglobin
        ) ||
        hemoglobin < 1 ||
        hemoglobin > 30
      ) {
        return "Hemoglobin must be between 1 and 30 g/dL.";
      }
    }

    return "";
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );

      return;
    }

    try {
      const now =
        new Date();

      const payload = {
        beneficiaryId:
          formData.beneficiaryId,

        visitId:
          formData.visitId,

        /*
         * Backend uses LocalDateTime.
         * Therefore remove trailing Z.
         */
        recordedAt:
          now
            .toISOString()
            .slice(0, 19),

        bloodPressure:
          formData.bloodPressure.trim() ||
          null,

        weight:
          formData.weight ===
          ""
            ? null
            : Number(
                formData.weight
              ),

        temperature:
          formData.temperature ===
          ""
            ? null
            : Number(
                formData.temperature
              ),

        hemoglobin:
          formData.hemoglobin ===
          ""
            ? null
            : Number(
                formData.hemoglobin
              ),

        diagnosis:
          formData.diagnosis.trim() ||
          null,

        prescription:
          formData.prescription.trim() ||
          null,

        notes:
          formData.notes.trim() ||
          null,
      };

      /*
       * Redux automatically handles:
       *
       * ONLINE
       * -> Backend POST
       *
       * OFFLINE
       * -> IndexedDB
       * -> Sync Queue
       */
      await dispatch(
        createHealthRecord(
          payload
        )
      ).unwrap();

      alert(
        "Health record saved successfully. It will synchronize when internet is available."
      );

      navigate(
        "/app/offline/health-records"
      );
    } catch (err) {
      console.error(
        "Failed to create offline health record:",
        err
      );

      setError(
        err?.message ||
          err ||
          "Failed to save health record."
      );
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loadingData) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-sm text-gray-500">
          Loading offline data...
        </p>
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-start gap-3">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/app/offline/health-records"
            )
          }
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <ArrowLeft
            size={20}
          />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Add Health Record
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Record health information for a beneficiary visit.
          </p>
        </div>

      </div>

      {/* OFFLINE BADGE */}

      <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">

        <WifiOff
          size={17}
        />

        <span>
          Offline Mode — This health record
          will be stored on this device and
          synchronized when internet returns.
        </span>

      </div>

      {/* ERROR */}

      {(error ||
        actionError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error ||
            actionError}
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-6 rounded-xl border bg-white p-6"
      >

        {/* BENEFICIARY */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Beneficiary
          </label>

          <select
            name="beneficiaryId"
            value={
              formData.beneficiaryId
            }
            onChange={
              handleChange
            }
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-violet-500"
          >

            <option value="">
              Select Beneficiary
            </option>

            {beneficiaries.map(
              (
                beneficiary
              ) => (
                <option
                  key={
                    beneficiary.id
                  }
                  value={
                    beneficiary.id
                  }
                >
                  {
                    beneficiary.name
                  }
                </option>
              )
            )}

          </select>

          {beneficiaries.length ===
            0 && (
            <p className="mt-2 text-sm text-gray-500">
              No beneficiaries are available offline.
            </p>
          )}

        </div>

        {/* VISIT */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Visit
          </label>

          <select
            name="visitId"
            value={
              formData.visitId
            }
            onChange={
              handleChange
            }
            disabled={
              !formData.beneficiaryId
            }
            className="w-full rounded-lg border px-3 py-2.5 outline-none disabled:bg-gray-100 focus:border-violet-500"
          >

            <option value="">
              {!formData.beneficiaryId
                ? "Select beneficiary first"
                : selectedBeneficiaryVisits.length ===
                    0
                  ? "No eligible visits available"
                  : "Select Visit"}
            </option>

            {selectedBeneficiaryVisits.map(
              (visit) => (
                <option
                  key={
                    visit.id
                  }
                  value={
                    visit.id
                  }
                >
                  {
                    visit.visitType ||
                    "Visit"
                  }{" "}
                  -{" "}
                  {
                    visit.scheduledDate ||
                    visit.visitDate ||
                    "No date"
                  }
                </option>
              )
            )}

          </select>

          {formData.beneficiaryId &&
            selectedBeneficiaryVisits.length ===
              0 && (
              <p className="mt-2 text-sm text-gray-500">
                No eligible visits are available.
                The visit may already have a health
                record or may be pending deletion.
              </p>
            )}

        </div>

        {/* VITAL INFORMATION */}

        <div>

          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Vital Information
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* BP */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Blood Pressure
              </label>

              <input
                type="text"
                name="bloodPressure"
                value={
                  formData.bloodPressure
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. 120/80"
                className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-violet-500"
              />

            </div>

            {/* WEIGHT */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Weight (kg)
              </label>

              <input
                type="number"
                name="weight"
                value={
                  formData.weight
                }
                onChange={
                  handleChange
                }
                min="1"
                max="300"
                step="0.1"
                placeholder="e.g. 65"
                className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-violet-500"
              />

            </div>

            {/* TEMPERATURE */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Temperature (°C)
              </label>

              <input
                type="number"
                name="temperature"
                value={
                  formData.temperature
                }
                onChange={
                  handleChange
                }
                min="30"
                max="45"
                step="0.1"
                placeholder="e.g. 36.8"
                className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-violet-500"
              />

            </div>

            {/* HEMOGLOBIN */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Hemoglobin (g/dL)
              </label>

              <input
                type="number"
                name="hemoglobin"
                value={
                  formData.hemoglobin
                }
                onChange={
                  handleChange
                }
                min="1"
                max="30"
                step="0.1"
                placeholder="e.g. 13.5"
                className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-violet-500"
              />

            </div>

          </div>

        </div>

        {/* DIAGNOSIS */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Diagnosis
          </label>

          <textarea
            name="diagnosis"
            value={
              formData.diagnosis
            }
            onChange={
              handleChange
            }
            rows={3}
            placeholder="Enter diagnosis..."
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-violet-500"
          />

        </div>

        {/* PRESCRIPTION */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Prescription
          </label>

          <textarea
            name="prescription"
            value={
              formData.prescription
            }
            onChange={
              handleChange
            }
            rows={3}
            placeholder="Enter prescription..."
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-violet-500"
          />

        </div>

        {/* NOTES */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Notes
          </label>

          <textarea
            name="notes"
            value={
              formData.notes
            }
            onChange={
              handleChange
            }
            rows={4}
            placeholder="Additional notes..."
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-violet-500"
          />

        </div>

        {/* BUTTONS */}

        <div className="flex justify-end gap-3 border-t pt-5">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/app/offline/health-records"
              )
            }
            className="rounded-lg border px-5 py-2.5 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              actionLoading
            }
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Save
              size={18}
            />

            {actionLoading
              ? "Saving..."
              : "Save Offline"}

          </button>

        </div>

      </form>
    </div>
  );
};

export default CreateOfflineHealthRecord;