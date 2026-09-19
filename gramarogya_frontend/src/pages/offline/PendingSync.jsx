import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  Clock3,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ClipboardList,
  HeartPulse,
  RotateCcw,
} from "lucide-react";

import db from "../../offline/db";

const getStatusConfig = (status) => {
  switch (status) {
    case "PENDING":
      return {
        label: "Pending",
        className:
          "bg-orange-100 text-orange-700 border-orange-200",
        icon: Clock3,
      };

    case "SYNCING":
      return {
        label: "Syncing",
        className:
          "bg-blue-100 text-blue-700 border-blue-200",
        icon: LoaderCircle,
      };

    case "SYNCED":
      return {
        label: "Synced",
        className:
          "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle2,
      };

    case "FAILED":
      return {
        label: "Failed",
        className:
          "bg-red-100 text-red-700 border-red-200",
        icon: AlertCircle,
      };

    default:
      return {
        label: status || "Unknown",
        className:
          "bg-gray-100 text-gray-700 border-gray-200",
        icon: Clock3,
      };
  }
};

const getEntityIcon = (entityType) => {
  switch (entityType) {
    case "VISIT":
      return ClipboardList;

    case "HEALTH_RECORD":
      return HeartPulse;

    default:
      return RefreshCw;
  }
};

const formatDateTime = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const PendingSync = () => {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadOperations = useCallback(
    async (showRefreshLoader = false) => {
      try {
        setError("");

        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const queue = await db.syncQueue
          .orderBy("createdAt")
          .reverse()
          .toArray();

        setOperations(queue);
      } catch (err) {
        console.error(
          "Failed to load sync queue:",
          err
        );

        setError(
          "Unable to load pending synchronization operations."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadOperations();
  }, [loadOperations]);

  const pendingCount = operations.filter(
    (item) => item.status === "PENDING"
  ).length;

  const syncingCount = operations.filter(
    (item) => item.status === "SYNCING"
  ).length;

  const failedCount = operations.filter(
    (item) => item.status === "FAILED"
  ).length;

  const syncedCount = operations.filter(
    (item) => item.status === "SYNCED"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Pending Sync
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Offline operations waiting to be synchronized
            with the server.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadOperations(true)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              refreshing ? "animate-spin" : ""
            }
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Pending
              </p>

              <p className="mt-1 text-2xl font-bold text-orange-600">
                {pendingCount}
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 p-3">
              <Clock3
                size={22}
                className="text-orange-600"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Syncing
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-600">
                {syncingCount}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              <LoaderCircle
                size={22}
                className="text-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Failed
              </p>

              <p className="mt-1 text-2xl font-bold text-red-600">
                {failedCount}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3">
              <AlertCircle
                size={22}
                className="text-red-600"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Synced
              </p>

              <p className="mt-1 text-2xl font-bold text-green-600">
                {syncedCount}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-3">
              <CheckCircle2
                size={22}
                className="text-green-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Operations */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h3 className="font-semibold text-slate-900">
            Synchronization Operations
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {operations.length} operation
            {operations.length !== 1 ? "s" : ""} in
            local synchronization queue.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
              Loading synchronization queue...
            </div>
          </div>
        ) : operations.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="rounded-full bg-green-50 p-4">
              <CheckCircle2
                size={30}
                className="text-green-600"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-800">
              No synchronization operations
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              All offline changes have been synchronized,
              or no offline changes have been created yet.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Type
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Operation
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Local ID
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Retry
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {operations.map((item) => {
                    const status =
                      getStatusConfig(
                        item.status
                      );

                    const StatusIcon =
                      status.icon;

                    const EntityIcon =
                      getEntityIcon(
                        item.entityType
                      );

                    return (
                      <tr
                        key={
                          item.id ||
                          item.operationId
                        }
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-violet-50 p-2">
                              <EntityIcon
                                size={18}
                                className="text-violet-600"
                              />
                            </div>

                            <span className="font-medium text-slate-800">
                              {item.entityType ||
                                "Unknown"}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {item.operation ||
                              "—"}
                          </span>
                        </td>

                        <td className="max-w-xs px-5 py-4">
                          <span
                            className="block truncate text-sm text-slate-600"
                            title={
                              item.localId
                            }
                          >
                            {item.localId ||
                              "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                          >
                            <StatusIcon
                              size={14}
                              className={
                                item.status ===
                                "SYNCING"
                                  ? "animate-spin"
                                  : ""
                              }
                            />

                            {status.label}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.retryCount ??
                            0}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDateTime(
                            item.createdAt
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y md:hidden">
              {operations.map((item) => {
                const status =
                  getStatusConfig(
                    item.status
                  );

                const StatusIcon =
                  status.icon;

                const EntityIcon =
                  getEntityIcon(
                    item.entityType
                  );

                return (
                  <div
                    key={
                      item.id ||
                      item.operationId
                    }
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-violet-50 p-2">
                          <EntityIcon
                            size={18}
                            className="text-violet-600"
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {item.entityType ||
                              "Unknown"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {item.operation ||
                              "—"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${status.className}`}
                      >
                        <StatusIcon
                          size={13}
                          className={
                            item.status ===
                            "SYNCING"
                              ? "animate-spin"
                              : ""
                          }
                        />

                        {status.label}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          Local ID
                        </span>

                        <span className="max-w-[220px] truncate text-right text-slate-700">
                          {item.localId ||
                            "—"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Retry Count
                        </span>

                        <span className="text-slate-700">
                          {item.retryCount ??
                            0}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          Created
                        </span>

                        <span className="text-right text-slate-700">
                          {formatDateTime(
                            item.createdAt
                          )}
                        </span>
                      </div>

                      {item.lastError && (
                        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                          <div className="flex gap-2">
                            <AlertCircle
                              size={15}
                              className="mt-0.5 shrink-0"
                            />

                            <span>
                              {item.lastError}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Information */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <RotateCcw
            size={20}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>
            <h3 className="font-medium text-blue-900">
              How synchronization works
            </h3>

            <p className="mt-1 text-sm leading-6 text-blue-800">
              Offline visits and health records are
              stored locally first. When internet
              connectivity returns, these operations
              will be synchronized with the GramArogya
              server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingSync;