import React, { useEffect } from "react";
import { History } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { getStockLogs } from "../../redux/slices/inventorySlice";

export default function MedicineStockHistory() {
  const dispatch = useDispatch();

  const {
    logs = [],
    loading,
    error,
  } = useSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(getStockLogs());
  }, [dispatch]);

  const getBadgeColor = (action) => {
    switch (action) {
      case "ADD":
        return "bg-green-100 text-green-700";

      case "UPDATE":
        return "bg-blue-100 text-blue-700";

      case "RECEIVE":
        return "bg-emerald-100 text-emerald-700";

      case "ISSUE":
        return "bg-orange-100 text-orange-700";

      case "DELETE":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getQuantityChange = (log) => {
    if (log.action === "ISSUE") {
      return `-${log.quantityChanged}`;
    }

    if (log.action === "RECEIVE") {
      return `+${log.quantityChanged}`;
    }

    return log.quantityChanged;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <History className="text-blue-600" />

        <div>
          <h1 className="text-2xl font-bold">
            Medicine Stock History
          </h1>

          <p className="text-slate-500">
            Track every inventory action.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-lg bg-white p-10 text-center text-slate-500">
          Loading stock history...
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-lg bg-white py-10 text-center text-slate-500">
          No stock history found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left">
                  Date
                </th>

                <th className="px-4 py-3 text-left">
                  Medicine
                </th>

                <th className="px-4 py-3 text-center">
                  Action
                </th>

                <th className="px-4 py-3 text-center">
                  Previous
                </th>

                <th className="px-4 py-3 text-center">
                  Changed
                </th>

                <th className="px-4 py-3 text-center">
                  Updated
                </th>

                <th className="px-4 py-3 text-left">
                  Performed By
                </th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    {log.performedAt
                      ? new Date(
                          log.performedAt
                        ).toLocaleString()
                      : "-"}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {log.medicineName || "-"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${getBadgeColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {log.previousStock ?? 0}
                  </td>

                  <td className="px-4 py-3 text-center font-semibold">
                    {getQuantityChange(log)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {log.updatedStock ?? 0}
                  </td>

                  <td className="px-4 py-3">
                    {log.performedBy || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}