import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, HeartPulse, WifiOff, Eye } from "lucide-react";
import { useSelector } from "react-redux";

import { getOfflineHealthRecords } from "../../offline/healthRecordOfflineService";
import { getOfflineBeneficiaries } from "../../offline/beneficiaryOfflineService";
import { getOfflineVisits } from "../../offline/visitOfflineService";

const OfflineHealthRecords = () => {
  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );

  const [healthRecords, setHealthRecords] =
    useState([]);

  const [beneficiaries, setBeneficiaries] =
    useState([]);

  const [visits, setVisits] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD OFFLINE HEALTH RECORDS
  ===================================================== */

  const loadHealthRecords = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user?.id) {
        setError(
          "ASHA user information is not available."
        );
        return;
      }

      const [
        records,
        offlineBeneficiaries,
        offlineVisits,
      ] = await Promise.all([
        getOfflineHealthRecords(),

        getOfflineBeneficiaries(
          user.id
        ),

        getOfflineVisits(
          user.id
        ),
      ]);

      /*
       * Only show records belonging to the
       * logged-in ASHA.
       *
       * Older synced records may not have
       * ashaId, so records without ashaId
       * are kept for compatibility.
       */
      const ashaRecords =
        (records || []).filter(
          (record) =>
            !record.ashaId ||
            record.ashaId === user.id
        );

      setHealthRecords(
        ashaRecords
      );

      setBeneficiaries(
        offlineBeneficiaries || []
      );

      setVisits(
        offlineVisits || []
      );
    } catch (err) {
      console.error(
        "Failed to load offline health records:",
        err
      );

      setError(
        "Failed to load offline health records."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD ON PAGE OPEN
  ===================================================== */

  useEffect(() => {
    loadHealthRecords();
  }, [user?.id]);

  /* =====================================================
     HELPERS
  ===================================================== */

  const getBeneficiaryName = (
    beneficiaryId
  ) => {
    const beneficiary =
      beneficiaries.find(
        (item) =>
          item.id ===
          beneficiaryId
      );

    return (
      beneficiary?.name ||
      "Unknown Beneficiary"
    );
  };

  const getVisit = (
    visitId
  ) => {
    return visits.find(
      (visit) =>
        visit.id === visitId
    );
  };

  const getVisitType = (
    visitId
  ) => {
    const visit =
      getVisit(visitId);

    return (
      visit?.visitType ||
      "Visit"
    );
  };

  const getVisitDate = (
    visitId
  ) => {
    const visit =
      getVisit(visitId);

    return (
      visit?.scheduledDate ||
      visit?.visitDate ||
      "No date"
    );
  };

  /* =====================================================
     SYNC STATUS
  ===================================================== */

  const getSyncStatus = (
    status
  ) => {
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
     COUNTS
  ===================================================== */

  const totalRecords =
    healthRecords.length;

  const pendingRecords =
    healthRecords.filter(
      (record) =>
        record.syncStatus ===
          "PENDING" ||
        record.syncStatus ===
          "SYNCING" ||
        record.syncStatus ===
          "FAILED"
    ).length;

  const syncedRecords =
    healthRecords.filter(
      (record) =>
        record.syncStatus ===
        "SYNCED"
    ).length;

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-sm text-gray-500">
          Loading offline health records...
        </p>
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-3">

          <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
            <HeartPulse
              size={24}
            />
          </div>

          <div>

            <h1 className="text-2xl font-semibold text-slate-900">
              Offline Health Records
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View and manage health information
              stored on this device.
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/app/offline/health-records/create"
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-violet-700"
        >
          <Plus size={18} />
          Add Health Record
        </button>

      </div>

      {/* =================================================
          OFFLINE INFO
      ================================================= */}

      <div className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">

        <WifiOff
          size={18}
          className="text-orange-600"
        />

        <div>

          <p className="text-sm font-medium text-orange-800">
            Offline Mode
          </p>

          <p className="text-xs text-orange-700">
            New health records are stored locally
            and will synchronize when internet
            connectivity returns.
          </p>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border bg-white p-5">

          <p className="text-sm text-gray-500">
            Total Records
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {totalRecords}
          </p>

        </div>

        <div className="rounded-xl border bg-white p-5">

          <p className="text-sm text-gray-500">
            Pending Sync
          </p>

          <p className="mt-2 text-2xl font-bold text-orange-600">
            {pendingRecords}
          </p>

        </div>

        <div className="rounded-xl border bg-white p-5">

          <p className="text-sm text-gray-500">
            Synced
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {syncedRecords}
          </p>

        </div>

      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {healthRecords.length ===
        0 && (
        <div className="rounded-xl border bg-white p-10 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <HeartPulse
              size={28}
            />
          </div>

          <h2 className="text-lg font-semibold text-slate-800">
            No Health Records
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            No health records are currently
            available offline. Create a health
            record after conducting a beneficiary
            visit.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/app/offline/health-records/create"
              )
            }
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            <Plus size={18} />
            Add Health Record
          </button>

        </div>
      )}

      {/* =================================================
          TABLE
      ================================================= */}

      {healthRecords.length >
        0 && (
        <div className="overflow-hidden rounded-xl border bg-white">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead className="border-b bg-gray-50">

                <tr>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Beneficiary
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Visit
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Visit Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Blood Pressure
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Weight
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Sync Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {healthRecords.map(
                  (record) => {
                    const sync =
                      getSyncStatus(
                        record.syncStatus
                      );

                    return (
                      <tr
                        key={
                          record.id
                        }
                        className="hover:bg-gray-50"
                      >

                        {/* BENEFICIARY */}

                        <td className="px-5 py-4">

                          <div className="font-medium text-slate-800">
                            {getBeneficiaryName(
                              record.beneficiaryId
                            )}
                          </div>

                          <div className="mt-1 text-xs text-gray-400">
                            {record.beneficiaryId}
                          </div>

                        </td>

                        {/* VISIT */}

                        <td className="px-5 py-4">

                          <span className="text-sm text-slate-700">
                            {getVisitType(
                              record.visitId
                            )}
                          </span>

                        </td>

                        {/* DATE */}

                        <td className="px-5 py-4 text-sm text-gray-600">

                          {getVisitDate(
                            record.visitId
                          )}

                        </td>

                        {/* BP */}

                        <td className="px-5 py-4 text-sm text-gray-700">

                          {record.bloodPressure ||
                            "—"}

                        </td>

                        {/* WEIGHT */}

                        <td className="px-5 py-4 text-sm text-gray-700">

                          {record.weight !==
                            null &&
                          record.weight !==
                            undefined
                            ? `${record.weight} kg`
                            : "—"}

                        </td>

                        {/* SYNC */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${sync.className}`}
                          >
                            {
                              sync.label
                            }
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/app/offline/health-records/${record.id}`
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-slate-600 hover:bg-gray-50"
                          >

                            <Eye
                              size={16}
                            />

                            View

                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
};

export default OfflineHealthRecords;