import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, WifiOff } from "lucide-react";
import { useSelector } from "react-redux";

import {
  getOfflineVisitById,
  updateOfflineVisit,
} from "../../offline/visitOfflineService";

import {
  getOfflineBeneficiaryById,
} from "../../offline/beneficiaryOfflineService";

import { addToSyncQueue } from "../../offline/syncQueueService";


const OfflineVisitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );

  const [visit, setVisit] = useState(null);
  const [beneficiary, setBeneficiary] =
    useState(null);

  const [formData, setFormData] = useState({
    status: "Pending",
    scheduledDate: "",
    nextVisitDate: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD VISIT
  ===================================================== */

  useEffect(() => {
    const loadVisit = async () => {
      try {
        setLoading(true);
        setError("");

        if (!user?.id) {
          throw new Error(
            "Logged-in ASHA not found."
          );
        }

        const storedVisit =
          await getOfflineVisitById(id);

        if (!storedVisit) {
          throw new Error(
            "Visit not found offline."
          );
        }

        if (
          storedVisit.ashaId &&
          storedVisit.ashaId !== user.id
        ) {
          throw new Error(
            "You are not allowed to access this visit."
          );
        }

        setVisit(storedVisit);

        setFormData({
          status:
            storedVisit.status ||
            "Pending",

          scheduledDate:
            storedVisit.scheduledDate ||
            "",

          nextVisitDate:
            storedVisit.nextVisitDate ||
            "",

          notes:
            storedVisit.notes ||
            "",
        });

        if (storedVisit.beneficiaryId) {
          const storedBeneficiary =
            await getOfflineBeneficiaryById(
              storedVisit.beneficiaryId
            );

          setBeneficiary(
            storedBeneficiary
          );
        }

      } catch (err) {
        console.error(
          "Failed to load offline visit:",
          err
        );

        setError(
          err.message ||
            "Failed to load visit."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVisit();
  }, [id, user?.id]);


  /* =====================================================
     HANDLE CHANGE
  ===================================================== */

  const handleChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  /* =====================================================
     SAVE VISIT
  ===================================================== */

  const handleSave = async (
    event
  ) => {
    event.preventDefault();

    if (!visit) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedVisit =
        await updateOfflineVisit(
          visit.id,
          {
            ...formData,

            beneficiaryId:
              visit.beneficiaryId,

            ashaId:
              user.id,
          }
        );

      /*
       * Create sync operation.
       */

      await addToSyncQueue({
        operationId:
          crypto.randomUUID(),

        entityType:
          "VISIT",

        operation:
          "UPDATE",

        localId:
          updatedVisit.id,

        payload:
          updatedVisit,

        ashaId:
          user.id,
      });

      setVisit(updatedVisit);

      alert(
        "Visit saved offline. It is now pending synchronization."
      );

      navigate(
        "/app/offline/visits"
      );

    } catch (err) {
      console.error(
        "Failed to save offline visit:",
        err
      );

      setError(
        err.message ||
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
          Loading visit...
        </p>
      </div>
    );
  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (error && !visit) {
    return (
      <div className="rounded-xl border bg-white p-8">
        <button
          onClick={() =>
            navigate(
              "/app/offline/visits"
            )
          }
          className="mb-5 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Back to Visits
        </button>

        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
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
            onClick={() =>
              navigate(
                "/app/offline/visits"
              )
            }
            className="mb-3 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={17} />
            Back to Visits
          </button>

          <h2 className="text-2xl font-bold text-slate-900">
            Conduct Field Visit
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update the visit information while working offline.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          <WifiOff size={16} />
          Offline Mode
        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* BENEFICIARY INFORMATION */}

      <div className="rounded-xl border bg-white p-6">

        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Beneficiary Information
        </h3>

        {beneficiary ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <p className="text-xs text-gray-500">
                Name
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {beneficiary.name ||
                  "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Age
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {beneficiary.age ??
                  "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Gender
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {beneficiary.gender ||
                  "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Village
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {beneficiary.village ||
                  "N/A"}
              </p>
            </div>

          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Beneficiary information is not available offline.
          </p>
        )}

      </div>


      {/* VISIT FORM */}

      <form
        onSubmit={handleSave}
        className="rounded-xl border bg-white p-6"
      >

        <h3 className="mb-6 text-lg font-semibold text-slate-900">
          Visit Information
        </h3>


        <div className="grid gap-5 sm:grid-cols-2">

          {/* VISIT TYPE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Visit Type
            </label>

            <input
              type="text"
              value={
                visit?.visitType ||
                ""
              }
              disabled
              className="w-full rounded-lg border bg-gray-100 px-3 py-2.5 text-sm text-gray-600"
            />
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


          {/* SCHEDULED DATE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Scheduled Date
            </label>

            <input
              type="date"
              name="scheduledDate"
              value={
                formData.scheduledDate
              }
              onChange={
                handleChange
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

        </div>


        {/* NOTES */}

        <div className="mt-5">

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
            placeholder="Enter observations or notes from the field visit..."
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

        </div>


        {/* OFFLINE NOTICE */}

        <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4">

          <div className="flex gap-3">

            <WifiOff
              size={20}
              className="mt-0.5 shrink-0 text-orange-600"
            />

            <div>
              <p className="text-sm font-semibold text-orange-800">
                Offline Save
              </p>

              <p className="mt-1 text-sm text-orange-700">
                This visit will be saved on this device and added to the pending synchronization queue.
              </p>
            </div>

          </div>

        </div>


        {/* ACTIONS */}

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
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : "Save Visit Offline"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default OfflineVisitDetail;