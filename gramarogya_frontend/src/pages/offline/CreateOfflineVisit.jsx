import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Save,
  WifiOff,
} from "lucide-react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useSelector } from "react-redux";

import {
  getOfflineBeneficiaries,
  getOfflineBeneficiaryById,
} from "../../offline/beneficiaryOfflineService";

import {
  createOfflineVisit,
} from "../../offline/visitOfflineService";

import {
  addToSyncQueue,
} from "../../offline/syncQueueService";


const CreateOfflineVisit = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const beneficiaryId =
    searchParams.get("beneficiaryId");

  const { user } = useSelector(
    (state) => state.auth
  );

  const [beneficiaries, setBeneficiaries] =
    useState([]);

  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState(null);

  const [formData, setFormData] =
    useState({
      beneficiaryId:
        beneficiaryId || "",

      visitType:
        "Home Visit",

      status:
        "Pending",

      scheduledDate:
        new Date()
          .toISOString()
          .split("T")[0],

      nextVisitDate:
        "",

      notes:
        "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =====================================================
     LOAD ASSIGNED BENEFICIARIES
  ===================================================== */

  useEffect(() => {
    const loadBeneficiaries =
      async () => {
        try {
          setLoading(true);
          setError("");

          if (!user?.id) {
            throw new Error(
              "Logged-in ASHA not found."
            );
          }

          /*
           * getOfflineBeneficiaries already filters
           * beneficiaries using the logged-in ASHA ID.
           *
           * We still perform an explicit ownership
           * filter here as an additional local
           * protection layer.
           */
          const data =
            await getOfflineBeneficiaries(
              user.id
            );

          const safeBeneficiaries =
            Array.isArray(data)
              ? data
              : [];

          const ownedBeneficiaries =
            safeBeneficiaries.filter(
              (beneficiary) =>
                beneficiary.ashaId ===
                user.id
            );

          setBeneficiaries(
            ownedBeneficiaries
          );

          /*
           * If beneficiaryId is provided in the URL,
           * verify it directly against IndexedDB
           * using the logged-in ASHA ID.
           */
          if (beneficiaryId) {
            const beneficiary =
              await getOfflineBeneficiaryById(
                beneficiaryId,
                user.id
              );

            if (
              !beneficiary
            ) {
              throw new Error(
                "Selected beneficiary is not assigned to the logged-in ASHA."
              );
            }

            /*
             * Extra ownership verification.
             */
            if (
              beneficiary.ashaId !==
              user.id
            ) {
              throw new Error(
                "Selected beneficiary is not assigned to you."
              );
            }

            setSelectedBeneficiary(
              beneficiary
            );

            /*
             * Keep the verified beneficiary ID
             * in the form.
             */
            setFormData(
              (prev) => ({
                ...prev,
                beneficiaryId:
                  beneficiary.id,
              })
            );
          }

        } catch (err) {
          console.error(
            "Failed to load offline beneficiaries:",
            err
          );

          setSelectedBeneficiary(
            null
          );

          setError(
            err?.message ||
              "Failed to load beneficiaries."
          );
        } finally {
          setLoading(false);
        }
      };

    loadBeneficiaries();
  }, [
    user?.id,
    beneficiaryId,
  ]);


  /* =====================================================
     HANDLE BENEFICIARY CHANGE
  ===================================================== */

  const handleBeneficiaryChange =
    async (event) => {
      const id =
        event.target.value;

      setError("");

      setFormData(
        (prev) => ({
          ...prev,
          beneficiaryId:
            id,
        })
      );

      if (!id) {
        setSelectedBeneficiary(
          null
        );

        return;
      }

      try {
        if (!user?.id) {
          throw new Error(
            "Logged-in ASHA not found."
          );
        }

        /*
         * Direct secure lookup.
         *
         * The service checks:
         * beneficiary exists
         * AND beneficiary.ashaId === user.id
         */
        const beneficiary =
          await getOfflineBeneficiaryById(
            id,
            user.id
          );

        if (!beneficiary) {
          setSelectedBeneficiary(
            null
          );

          setError(
            "This beneficiary is not available offline or is not assigned to the logged-in ASHA."
          );

          return;
        }

        /*
         * Extra explicit ownership check.
         */
        if (
          beneficiary.ashaId !==
          user.id
        ) {
          setSelectedBeneficiary(
            null
          );

          setError(
            "This beneficiary is not assigned to you."
          );

          return;
        }

        setSelectedBeneficiary(
          beneficiary
        );

      } catch (err) {
        console.error(
          "Failed to select offline beneficiary:",
          err
        );

        setSelectedBeneficiary(
          null
        );

        setError(
          err?.message ||
            "Unable to load selected beneficiary."
        );
      }
    };


  /* =====================================================
     HANDLE FORM CHANGE
  ===================================================== */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setError("");

    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };


  /* =====================================================
     VALIDATE VISIT
  ===================================================== */

  const validateVisit = async () => {
    if (!user?.id) {
      return "Logged-in ASHA not found.";
    }

    if (
      !formData.beneficiaryId
    ) {
      return "Please select a beneficiary.";
    }

    /*
     * Final ownership check directly against
     * IndexedDB before creating the visit.
     *
     * This prevents relying only on the UI state.
     */
    const verifiedBeneficiary =
      await getOfflineBeneficiaryById(
        formData.beneficiaryId,
        user.id
      );

    if (!verifiedBeneficiary) {
      return "Selected beneficiary is not available offline or does not belong to the logged-in ASHA.";
    }

    /*
     * Explicit ownership verification.
     */
    if (
      verifiedBeneficiary.ashaId !==
      user.id
    ) {
      return "Selected beneficiary is not assigned to the logged-in ASHA.";
    }

    return "";
  };


  /* =====================================================
     SAVE OFFLINE VISIT
  ===================================================== */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setError("");

      /*
       * Final validation happens immediately
       * before writing anything to IndexedDB.
       */
      const validationError =
        await validateVisit();

      if (validationError) {
        throw new Error(
          validationError
        );
      }

      /*
       * Re-fetch the beneficiary one final time.
       *
       * This ensures we use the actual IndexedDB
       * record rather than trusting stale UI state.
       */
      const verifiedBeneficiary =
        await getOfflineBeneficiaryById(
          formData.beneficiaryId,
          user.id
        );

      if (!verifiedBeneficiary) {
        throw new Error(
          "Selected beneficiary is no longer available offline."
        );
      }

      if (
        verifiedBeneficiary.ashaId !==
        user.id
      ) {
        throw new Error(
          "You are not authorized to create a visit for this beneficiary."
        );
      }

      setSaving(true);

      const localVisitId =
        `LOCAL_VISIT_${crypto.randomUUID()}`;

      const operationId =
        crypto.randomUUID();

      const now =
        new Date().toISOString();

      /*
       * Create the offline visit.
       *
       * ASHA ownership is explicitly stored.
       */
      const offlineVisit = {
        id:
          localVisitId,

        beneficiaryId:
          verifiedBeneficiary.id,

        ashaId:
          user.id,

        visitType:
          formData.visitType,

        status:
          formData.status,

        scheduledDate:
          formData.scheduledDate,

        nextVisitDate:
          formData.nextVisitDate ||
          null,

        notes:
          formData.notes.trim(),

        visitDate:
          now.split("T")[0],

        syncStatus:
          "PENDING",

        isOffline:
          true,

        createdAt:
          now,

        updatedAt:
          now,
      };


      /* -----------------------------------------------
         SAVE VISIT TO INDEXEDDB
      ----------------------------------------------- */

      await createOfflineVisit(
        offlineVisit
      );


      /* -----------------------------------------------
         ADD VISIT TO SYNC QUEUE
      ----------------------------------------------- */

      await addToSyncQueue({
        operationId,

        entityType:
          "VISIT",

        operation:
          "CREATE",

        localId:
          localVisitId,

        payload:
          offlineVisit,

        ashaId:
          user.id,
      });


      alert(
        "Field visit saved offline and added to pending sync."
      );

      navigate(
        "/app/offline/visits"
      );

    } catch (err) {
      console.error(
        "Failed to create offline visit:",
        err
      );

      setError(
        err?.message ||
          "Failed to save visit."
      );
    } finally {
      setSaving(false);
    }
  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-gray-500">
          Loading beneficiaries...
        </p>
      </div>
    );
  }


  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/app/offline/visits"
              )
            }
            className="mb-3 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft
              size={17}
            />

            Back to Visits
          </button>

          <h2 className="text-2xl font-bold text-slate-900">
            Start New Field Visit
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Record a beneficiary visit while working offline.
          </p>

        </div>


        <div className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600">

          <WifiOff
            size={16}
          />

          Offline Mode

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* FORM */}

      <form
        onSubmit={
          handleSubmit
        }
        className="rounded-xl border bg-white p-6"
      >

        <h3 className="mb-6 text-lg font-semibold text-slate-900">
          Field Visit Details
        </h3>


        <div className="grid gap-5 sm:grid-cols-2">


          {/* BENEFICIARY */}

          <div className="sm:col-span-2">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Beneficiary
            </label>

            <select
              name="beneficiaryId"
              value={
                formData.beneficiaryId
              }
              onChange={
                handleBeneficiaryChange
              }
              disabled={
                Boolean(
                  beneficiaryId
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-gray-100"
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

                    {beneficiary.village
                      ? ` - ${beneficiary.village}`
                      : ""}
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


          {/* SELECTED BENEFICIARY */}

          {selectedBeneficiary && (
            <div className="sm:col-span-2 rounded-lg border bg-gray-50 p-4">

              <p className="mb-3 text-sm font-semibold text-slate-800">
                Selected Beneficiary
              </p>

              <div className="grid gap-3 sm:grid-cols-3">

                <div>

                  <p className="text-xs text-gray-500">
                    Name
                  </p>

                  <p className="font-medium text-slate-800">
                    {
                      selectedBeneficiary.name
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs text-gray-500">
                    Age
                  </p>

                  <p className="font-medium text-slate-800">
                    {
                      selectedBeneficiary.age ??
                      "N/A"
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs text-gray-500">
                    Village
                  </p>

                  <p className="font-medium text-slate-800">
                    {
                      selectedBeneficiary.village ||
                      "N/A"
                    }
                  </p>

                </div>

              </div>

            </div>
          )}


          {/* VISIT TYPE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Visit Type
            </label>

            <select
              name="visitType"
              value={
                formData.visitType
              }
              onChange={
                handleChange
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >

              <option value="Home Visit">
                Home Visit
              </option>

              <option value="Follow Up">
                Follow Up
              </option>

              <option value="Vaccination">
                Vaccination
              </option>

              <option value="ANC Checkup">
                ANC Checkup
              </option>

              <option value="PNC Visit">
                PNC Visit
              </option>

            </select>

          </div>


          {/* STATUS */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={
                formData.status
              }
              onChange={
                handleChange
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >

              <option value="Pending">
                Pending
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Missed">
                Missed
              </option>

            </select>

          </div>


          {/* VISIT DATE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Visit Date
            </label>

            <input
              type="date"
              value={
                formData.scheduledDate
              }
              onChange={(event) =>
                setFormData(
                  (prev) => ({
                    ...prev,
                    scheduledDate:
                      event.target.value,
                  })
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />

          </div>


          {/* NEXT VISIT */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Next Visit Date
            </label>

            <input
              type="date"
              name="nextVisitDate"
              value={
                formData.nextVisitDate
              }
              onChange={
                handleChange
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />

          </div>


          {/* NOTES */}

          <div className="sm:col-span-2">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Visit Notes
            </label>

            <textarea
              name="notes"
              value={
                formData.notes
              }
              onChange={
                handleChange
              }
              rows={5}
              placeholder="Enter observations from the field visit..."
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />

          </div>

        </div>


        {/* OFFLINE INFORMATION */}

        <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4">

          <div className="flex gap-3">

            <WifiOff
              size={20}
              className="mt-0.5 shrink-0 text-orange-600"
            />

            <div>

              <p className="text-sm font-semibold text-orange-800">
                Offline Visit
              </p>

              <p className="mt-1 text-sm text-orange-700">
                This visit will be stored on the device and synchronized with the server when internet connectivity returns.
              </p>

            </div>

          </div>

        </div>


        {/* BUTTONS */}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/app/offline/visits"
              )
            }
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>


          <button
            type="submit"
            disabled={
              saving ||
              !selectedBeneficiary
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <Save
              size={17}
            />

            {saving
              ? "Saving..."
              : "Save Visit Offline"}

          </button>

        </div>

      </form>

    </div>
  );
};

export default CreateOfflineVisit;
