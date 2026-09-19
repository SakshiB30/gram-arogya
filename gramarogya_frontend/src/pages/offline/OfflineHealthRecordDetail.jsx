import React, {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Edit,
  Trash2,
  HeartPulse,
  WifiOff,
  Save,
  X,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchHealthRecordById,
  updateHealthRecord,
  deleteHealthRecord,
} from "../../redux/slices/healthRecordSlice";

import {
  getOfflineBeneficiaryById,
} from "../../offline/beneficiaryOfflineService";

import {
  getOfflineVisitById,
} from "../../offline/visitOfflineService";

const OfflineHealthRecordDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { user } = useSelector(
    (state) => state.auth
  );

  const {
    selectedHealthRecord,
    loading,
    actionLoading,
    actionError,
  } = useSelector(
    (state) => state.healthRecords
  );

  const [beneficiary, setBeneficiary] =
    useState(null);

  const [visit, setVisit] =
    useState(null);

  const [editing, setEditing] =
    useState(false);

  const [formData, setFormData] =
    useState({
      bloodPressure: "",
      weight: "",
      temperature: "",
      hemoglobin: "",
      diagnosis: "",
      prescription: "",
      notes: "",
    });

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD HEALTH RECORD
  ===================================================== */

  useEffect(() => {
    if (!id || !user?.id) {
      return;
    }

    /*
     * Redux thunk performs the actual
     * ASHA ownership check.
     */
    dispatch(
      fetchHealthRecordById(id)
    );
  }, [
    dispatch,
    id,
    user?.id,
  ]);

  /* =====================================================
     LOAD BENEFICIARY + VISIT
  ===================================================== */

  useEffect(() => {
    const loadRelatedData =
      async () => {
        if (
          !selectedHealthRecord ||
          !user?.id
        ) {
          return;
        }

        try {
          /*
           * Both related records are now
           * checked against the logged-in ASHA.
           */
          const [
            beneficiaryData,
            visitData,
          ] = await Promise.all([
            getOfflineBeneficiaryById(
              selectedHealthRecord.beneficiaryId,
              user.id
            ),

            getOfflineVisitById(
              selectedHealthRecord.visitId,
              user.id
            ),
          ]);

          setBeneficiary(
            beneficiaryData
          );

          setVisit(visitData);
        } catch (err) {
          console.error(
            "Failed to load related offline data:",
            err
          );

          setBeneficiary(null);
          setVisit(null);
        }
      };

    loadRelatedData();
  }, [
    selectedHealthRecord,
    user?.id,
  ]);

  /* =====================================================
     LOAD FORM DATA
  ===================================================== */

  useEffect(() => {
    if (!selectedHealthRecord) {
      return;
    }

    setFormData({
      bloodPressure:
        selectedHealthRecord.bloodPressure ||
        "",

      weight:
        selectedHealthRecord.weight ??
        "",

      temperature:
        selectedHealthRecord.temperature ??
        "",

      hemoglobin:
        selectedHealthRecord.hemoglobin ??
        "",

      diagnosis:
        selectedHealthRecord.diagnosis ||
        "",

      prescription:
        selectedHealthRecord.prescription ||
        "",

      notes:
        selectedHealthRecord.notes ||
        "",
    });
  }, [selectedHealthRecord]);

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /* =====================================================
     UPDATE RECORD
  ===================================================== */

  const handleSave = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (!selectedHealthRecord) {
      return;
    }

    if (!user?.id) {
      setError(
        "ASHA user information is unavailable."
      );
      return;
    }

    /* ---------------------------------------------
       Numeric validation
    --------------------------------------------- */

    if (
      formData.weight !== "" &&
      (
        Number(formData.weight) < 1 ||
        Number(formData.weight) > 300
      )
    ) {
      setError(
        "Weight must be between 1 and 300 kg."
      );
      return;
    }

    if (
      formData.temperature !== "" &&
      (
        Number(formData.temperature) < 30 ||
        Number(formData.temperature) > 45
      )
    ) {
      setError(
        "Temperature must be between 30 and 45 °C."
      );
      return;
    }

    if (
      formData.hemoglobin !== "" &&
      (
        Number(formData.hemoglobin) < 1 ||
        Number(formData.hemoglobin) > 30
      )
    ) {
      setError(
        "Hemoglobin must be between 1 and 30 g/dL."
      );
      return;
    }

    try {
      await dispatch(
        updateHealthRecord({
          id: selectedHealthRecord.id,

          healthRecord: {
            beneficiaryId:
              selectedHealthRecord.beneficiaryId,

            visitId:
              selectedHealthRecord.visitId,

            recordedAt:
              selectedHealthRecord.recordedAt,

            bloodPressure:
              formData.bloodPressure.trim() ||
              null,

            weight:
              formData.weight === ""
                ? null
                : Number(formData.weight),

            temperature:
              formData.temperature === ""
                ? null
                : Number(
                    formData.temperature
                  ),

            hemoglobin:
              formData.hemoglobin === ""
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

            /*
             * Ownership is also carried
             * through the offline Redux flow.
             */
            ashaId: user.id,
          },
        })
      ).unwrap();

      setEditing(false);

      alert(
        "Health record updated successfully."
      );
    } catch (err) {
      console.error(
        "Failed to update health record:",
        err
      );

      setError(
        typeof err === "string"
          ? err
          : err?.message ||
              "Failed to update health record."
      );
    }
  };

  /* =====================================================
     DELETE RECORD
  ===================================================== */

  const handleDelete = async () => {
    if (!selectedHealthRecord) {
      return;
    }

    if (!user?.id) {
      setError(
        "ASHA user information is unavailable."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this health record?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        deleteHealthRecord(
          selectedHealthRecord.id
        )
      ).unwrap();

      alert(
        "Health record deleted successfully."
      );

      navigate(
        "/app/offline/health-records",
        {
          replace: true,
        }
      );
    } catch (err) {
      console.error(
        "Failed to delete health record:",
        err
      );

      setError(
        typeof err === "string"
          ? err
          : err?.message ||
              "Failed to delete health record."
      );
    }
  };

  /* =====================================================
     CANCEL EDIT
  ===================================================== */

  const handleCancelEdit =
    () => {
      if (selectedHealthRecord) {
        setFormData({
          bloodPressure:
            selectedHealthRecord.bloodPressure ||
            "",

          weight:
            selectedHealthRecord.weight ??
            "",

          temperature:
            selectedHealthRecord.temperature ??
            "",

          hemoglobin:
            selectedHealthRecord.hemoglobin ??
            "",

          diagnosis:
            selectedHealthRecord.diagnosis ||
            "",

          prescription:
            selectedHealthRecord.prescription ||
            "",

          notes:
            selectedHealthRecord.notes ||
            "",
        });
      }

      setError("");
      setEditing(false);
    };

  /* =====================================================
     SYNC STATUS
  ===================================================== */

  const getSyncStatus =
    (status) => {
      switch (status) {
        case "PENDING":
          return {
            label: "Pending Sync",
            className:
              "bg-orange-100 text-orange-700",
          };

        case "SYNCING":
          return {
            label: "Syncing",
            className:
              "bg-blue-100 text-blue-700",
          };

        case "FAILED":
          return {
            label: "Sync Failed",
            className:
              "bg-red-100 text-red-700",
          };

        case "PENDING_DELETE":
          return {
            label: "Pending Delete",
            className:
              "bg-red-100 text-red-700",
          };

        case "SYNCED":
        default:
          return {
            label: "Synced",
            className:
              "bg-green-100 text-green-700",
          };
      }
    };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <p className="text-sm text-gray-500">
          Loading health record...
        </p>
      </div>
    );
  }

  /* =====================================================
     RECORD NOT FOUND
  ===================================================== */

  if (!selectedHealthRecord) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">

        <HeartPulse
          size={40}
          className="mx-auto text-gray-400"
        />

        <h2 className="mt-4 text-lg font-semibold text-slate-800">
          Health Record Not Found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          This health record is not available
          on this device or you are not
          authorized to access it.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/app/offline/health-records"
            )
          }
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
        >
          <ArrowLeft size={17} />
          Back to Health Records
        </button>

      </div>
    );
  }

  const sync =
    getSyncStatus(
      selectedHealthRecord.syncStatus
    );

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/app/offline/health-records"
              )
            }
            className="rounded-lg border bg-white p-2 text-slate-600 hover:bg-gray-50"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
            <HeartPulse size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Health Record
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Offline health information
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2">

          {!editing && (
            <button
              type="button"
              onClick={() =>
                setEditing(true)
              }
              className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50"
            >
              <Edit size={17} />
              Edit
            </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={17} />
            Delete
          </button>

        </div>

      </div>

      {/* OFFLINE STATUS */}

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">

        <WifiOff
          size={18}
          className="text-orange-600"
        />

        <span className="text-sm font-medium text-orange-800">
          Offline Mode
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${sync.className}`}
        >
          {sync.label}
        </span>

      </div>

      {/* ERROR */}

      {(error || actionError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || actionError}
        </div>
      )}

      {/* BENEFICIARY INFORMATION */}

      <div className="rounded-xl border bg-white p-6">

        <h2 className="text-lg font-semibold text-slate-800">
          Beneficiary Information
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div>
            <p className="text-xs text-gray-500">
              Name
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {beneficiary?.name ||
                "Unknown Beneficiary"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Beneficiary ID
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {selectedHealthRecord.beneficiaryId}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Age
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {beneficiary?.age ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Gender
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {beneficiary?.gender || "—"}
            </p>
          </div>

        </div>

      </div>

      {/* VISIT INFORMATION */}

      <div className="rounded-xl border bg-white p-6">

        <h2 className="text-lg font-semibold text-slate-800">
          Visit Information
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div>
            <p className="text-xs text-gray-500">
              Visit Type
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {visit?.visitType || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Visit Date
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {visit?.visitDate ||
                visit?.scheduledDate ||
                "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Visit Status
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {visit?.status || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Visit ID
            </p>

            <p className="mt-1 break-all font-medium text-slate-800">
              {selectedHealthRecord.visitId}
            </p>
          </div>

        </div>

      </div>

      {/* HEALTH INFORMATION */}

      <form
        onSubmit={handleSave}
        className="rounded-xl border bg-white p-6"
      >

        <div className="flex items-center justify-between">

          <h2 className="text-lg font-semibold text-slate-800">
            Health Information
          </h2>

          {editing && (
            <div className="flex gap-2">

              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-slate-600 hover:bg-gray-50"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />
                {actionLoading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>
          )}

        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          {/* BLOOD PRESSURE */}

          <div>

            <label className="text-sm font-medium text-slate-700">
              Blood Pressure
            </label>

            {editing ? (
              <input
                type="text"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleChange}
                placeholder="e.g. 120/80"
                className="mt-2 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            ) : (
              <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-slate-800">
                {selectedHealthRecord.bloodPressure || "—"}
              </p>
            )}

          </div>

          {/* WEIGHT */}

          <div>

            <label className="text-sm font-medium text-slate-700">
              Weight (kg)
            </label>

            {editing ? (
              <input
                type="number"
                name="weight"
                min="1"
                max="300"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            ) : (
              <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-slate-800">
                {selectedHealthRecord.weight ?? "—"}
                {selectedHealthRecord.weight !== null &&
                selectedHealthRecord.weight !== undefined
                  ? " kg"
                  : ""}
              </p>
            )}

          </div>

          {/* TEMPERATURE */}

          <div>

            <label className="text-sm font-medium text-slate-700">
              Temperature (°C)
            </label>

            {editing ? (
              <input
                type="number"
                name="temperature"
                min="30"
                max="45"
                step="0.1"
                value={formData.temperature}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            ) : (
              <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-slate-800">
                {selectedHealthRecord.temperature ?? "—"}
                {selectedHealthRecord.temperature !== null &&
                selectedHealthRecord.temperature !== undefined
                  ? " °C"
                  : ""}
              </p>
            )}

          </div>

          {/* HEMOGLOBIN */}

          <div>

            <label className="text-sm font-medium text-slate-700">
              Hemoglobin (g/dL)
            </label>

            {editing ? (
              <input
                type="number"
                name="hemoglobin"
                min="1"
                max="30"
                step="0.1"
                value={formData.hemoglobin}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            ) : (
              <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-slate-800">
                {selectedHealthRecord.hemoglobin ?? "—"}
                {selectedHealthRecord.hemoglobin !== null &&
                selectedHealthRecord.hemoglobin !== undefined
                  ? " g/dL"
                  : ""}
              </p>
            )}

          </div>

        </div>

        {/* DIAGNOSIS */}

        <div className="mt-5">

          <label className="text-sm font-medium text-slate-700">
            Diagnosis
          </label>

          {editing ? (
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              rows={3}
              className="mt-2 w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          ) : (
            <div className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 px-3 py-3 text-sm text-slate-800">
              {selectedHealthRecord.diagnosis ||
                "No diagnosis recorded."}
            </div>
          )}

        </div>

        {/* PRESCRIPTION */}

        <div className="mt-5">

          <label className="text-sm font-medium text-slate-700">
            Prescription
          </label>

          {editing ? (
            <textarea
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              rows={3}
              className="mt-2 w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          ) : (
            <div className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 px-3 py-3 text-sm text-slate-800">
              {selectedHealthRecord.prescription ||
                "No prescription recorded."}
            </div>
          )}

        </div>

        {/* NOTES */}

        <div className="mt-5">

          <label className="text-sm font-medium text-slate-700">
            Notes
          </label>

          {editing ? (
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          ) : (
            <div className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 px-3 py-3 text-sm text-slate-800">
              {selectedHealthRecord.notes ||
                "No notes recorded."}
            </div>
          )}

        </div>

      </form>

      {/* RECORD METADATA */}

      <div className="rounded-xl border bg-white p-6">

        <h2 className="text-lg font-semibold text-slate-800">
          Record Information
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">

          <div>
            <p className="text-xs text-gray-500">
              Record ID
            </p>

            <p className="mt-1 break-all text-sm font-medium text-slate-800">
              {selectedHealthRecord.id}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Recorded At
            </p>

            <p className="mt-1 text-sm font-medium text-slate-800">
              {selectedHealthRecord.recordedAt
                ? new Date(
                    selectedHealthRecord.recordedAt
                  ).toLocaleString()
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              ASHA ID
            </p>

            <p className="mt-1 break-all text-sm font-medium text-slate-800">
              {selectedHealthRecord.ashaId ||
                user?.id ||
                "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Sync Status
            </p>

            <span
              className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${sync.className}`}
            >
              {sync.label}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default OfflineHealthRecordDetail;