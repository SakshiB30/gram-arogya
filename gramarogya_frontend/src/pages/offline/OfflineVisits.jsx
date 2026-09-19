import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Calendar,
  User,
  MapPin,
  Eye,
  Trash2,
  WifiOff,
} from "lucide-react";

import {
  getOfflineVisits,
  deleteOfflineVisit,
} from "../../offline/visitOfflineService";

import { addToSyncQueue } from "../../offline/syncQueueService";

import db from "../../offline/db";

const OfflineVisits = () => {
  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =====================================================
     LOAD OFFLINE VISITS
  ===================================================== */

  useEffect(() => {
    const loadVisits = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.id) {
          setVisits([]);
          return;
        }

        const offlineVisits =
          await getOfflineVisits(user.id);

        if (!Array.isArray(offlineVisits)) {
          setVisits([]);
          return;
        }

        /*
         * Get beneficiary details from IndexedDB.
         */
        const visitsWithBeneficiaries =
          await Promise.all(
            offlineVisits.map(async (visit) => {
              const beneficiary =
                await db.beneficiaries.get(
                  visit.beneficiaryId
                );

              return {
                ...visit,

                beneficiaryName:
                  beneficiary?.name ||
                  "Unknown Beneficiary",

                village:
                  beneficiary?.village ||
                  "",
              };
            })
          );

        setVisits(
          visitsWithBeneficiaries
        );
      } catch (err) {
        console.error(
          "Failed to load offline visits:",
          err
        );

        setError(
          "Failed to load offline visits."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVisits();
  }, [user?.id]);

  /* =====================================================
     DELETE OFFLINE VISIT
  ===================================================== */

  const handleDelete = async (visit) => {
    if (!user?.id || !visit?.id) {
      return;
    }

    /*
     * Prevent deleting a visit that is already
     * waiting for deletion.
     */
    if (
      visit.syncStatus ===
      "PENDING_DELETE"
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this visit? The deletion will be synchronized when the network is available."
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      /*
       * Secure delete.
       *
       * deleteOfflineVisit() verifies that
       * this visit belongs to the logged-in ASHA.
       */
      const deletedVisit =
        await deleteOfflineVisit(
          visit.id,
          user.id
        );

      /*
       * Add DELETE operation to sync queue.
       */
      await addToSyncQueue({
        operationId:
          crypto.randomUUID(),

        entityType: "VISIT",

        operation: "DELETE",

        localId:
          deletedVisit.id,

        payload:
          deletedVisit,

        ashaId:
          user.id,
      });

      /*
       * Keep the visit in the list temporarily
       * so the ASHA can see PENDING_DELETE status.
       */
      setVisits((currentVisits) =>
        currentVisits.map(
          (currentVisit) =>
            currentVisit.id ===
            deletedVisit.id
              ? {
                  ...currentVisit,
                  ...deletedVisit,
                }
              : currentVisit
        )
      );
    } catch (err) {
      console.error(
        "Failed to delete offline visit:",
        err
      );

      setError(
        err?.message ||
          "Failed to delete visit."
      );
    }
  };

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      const parsedDate =
        new Date(date);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return "-";
      }

      return parsedDate.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "-";
    }
  };

  /* =====================================================
     STATUS STYLE
  ===================================================== */

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Missed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /* =====================================================
     SYNC STATUS STYLE
  ===================================================== */

  const getSyncStatusStyle = (
    syncStatus
  ) => {
    switch (syncStatus) {
      case "PENDING":
        return "bg-orange-100 text-orange-700";

      case "SYNCING":
        return "bg-blue-100 text-blue-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      case "PENDING_DELETE":
        return "bg-red-100 text-red-700";

      default:
        return "bg-green-100 text-green-700";
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-violet-600" />

        <p className="text-sm text-gray-500">
          Loading offline visits...
        </p>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-700">
          {error}
        </p>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="space-y-6">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
              <ClipboardList size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Field Visits
              </h2>

              <p className="text-sm text-gray-500">
                Your visits available offline
              </p>
            </div>

          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/app/offline/visits/create"
              )
            }
            className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
          >
            + Start New Field Visit
          </button>

          <div className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
            <WifiOff size={17} />
            Offline
          </div>

        </div>

      </div>

      {/* =========================
          SUMMARY
      ========================= */}

      <div className="grid gap-4 sm:grid-cols-3">

        {/* TOTAL */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
              <ClipboardList size={20} />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Total Visits
              </p>

              <p className="text-2xl font-bold text-slate-800">
                {visits.length}
              </p>

            </div>

          </div>

        </div>

        {/* COMPLETED */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-green-100 p-2 text-green-600">
              <Calendar size={20} />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Completed
              </p>

              <p className="text-2xl font-bold text-slate-800">
                {
                  visits.filter(
                    (visit) =>
                      visit.status ===
                      "Completed"
                  ).length
                }
              </p>

            </div>

          </div>

        </div>

        {/* PENDING SYNC */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
              <ClipboardList size={20} />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Pending Sync
              </p>

              <p className="text-2xl font-bold text-slate-800">
                {
                  visits.filter(
                    (visit) =>
                      visit.syncStatus ===
                        "PENDING" ||
                      visit.syncStatus ===
                        "SYNCING" ||
                      visit.syncStatus ===
                        "FAILED" ||
                      visit.syncStatus ===
                        "PENDING_DELETE"
                  ).length
                }
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =========================
          EMPTY STATE
      ========================= */}

      {visits.length === 0 ? (

        <div className="rounded-xl bg-white p-12 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <ClipboardList size={28} />
          </div>

          <h3 className="text-lg font-semibold text-slate-800">
            No Offline Visits
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            No visits are currently available
            for offline use.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/app/offline/visits/create"
              )
            }
            className="mt-5 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            + Start New Field Visit
          </button>

        </div>

      ) : (

        /* =========================
           VISITS TABLE
        ========================= */

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="border-b px-6 py-4">

            <h3 className="font-semibold text-slate-800">
              Available Visits
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Visits stored on this device
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Beneficiary
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Visit Type
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Scheduled Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Sync
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {visits.map((visit) => (

                  <tr
                    key={visit.id}
                    className="hover:bg-gray-50"
                  >

                    {/* BENEFICIARY */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="rounded-lg bg-violet-100 p-2 text-violet-600">
                          <User size={18} />
                        </div>

                        <div>

                          <p className="font-medium text-slate-800">
                            {visit.beneficiaryName ||
                              "Unknown Beneficiary"}
                          </p>

                          {visit.village && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">

                              <MapPin size={12} />

                              {visit.village}

                            </div>
                          )}

                        </div>

                      </div>

                    </td>

                    {/* VISIT TYPE */}

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {visit.visitType || "-"}
                    </td>

                    {/* DATE */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2 text-sm text-gray-700">

                        <Calendar size={16} />

                        {formatDate(
                          visit.scheduledDate ||
                            visit.visitDate
                        )}

                      </div>

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          visit.status
                        )}`}
                      >
                        {visit.status || "-"}
                      </span>

                    </td>

                    {/* SYNC */}

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getSyncStatusStyle(
                          visit.syncStatus
                        )}`}
                      >
                        {visit.syncStatus ||
                          "SYNCED"}
                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        {/* VIEW */}

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/app/offline/visits/${visit.id}`
                            )
                          }
                          disabled={
                            visit.syncStatus ===
                            "PENDING_DELETE"
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Eye size={16} />
                          View
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(visit)
                          }
                          disabled={
                            visit.syncStatus ===
                            "PENDING_DELETE"
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                          {visit.syncStatus ===
                          "PENDING_DELETE"
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
};

export default OfflineVisits;