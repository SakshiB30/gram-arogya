import React from "react";
import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const HealthRecordTable = ({
  healthRecords = [],
  onView,
  onEdit,
  onDelete,
}) => {
  const getSyncStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            Pending Sync
          </span>
        );

      case "SYNCING":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            Syncing...
          </span>
        );

      case "FAILED":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            Sync Failed
          </span>
        );

      case "SYNCED":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Synced
          </span>
        );

      case "PENDING_DELETE":
        return (
          <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
            Pending Delete
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            Synced
          </span>
        );
    }
  };

  const getBeneficiaryName = (record) => {
    return (
      record.beneficiaryName ||
      record.beneficiary?.name ||
      "Unknown Beneficiary"
    );
  };

  const getTemperature = (temperature) => {
    if (
      temperature === null ||
      temperature === undefined ||
      temperature === ""
    ) {
      return "-";
    }

    return `${temperature} °C`;
  };

  const getValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    return value;
  };

  /*
   * Do not show locally deleted health records.
   *
   * A PENDING_DELETE record is still kept in IndexedDB
   * because the sync engine needs it to tell the backend
   * to delete the server record.
   *
   * Therefore:
   *
   * IndexedDB -> keep it
   * UI         -> hide it
   */
  const visibleRecords = healthRecords.filter(
    (record) =>
      record.syncStatus !== "PENDING_DELETE"
  );

  if (visibleRecords.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-gray-500">
          No health records found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              #
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Beneficiary
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              BP
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Weight
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Temperature
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Hemoglobin
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Diagnosis
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Prescription
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Sync Status
            </th>

            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {visibleRecords.map(
            (record, index) => (
              <tr
                key={record.id}
                className="hover:bg-gray-50"
              >
                {/* Number */}
                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                  {index + 1}
                </td>

                {/* Beneficiary */}
                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                  {getBeneficiaryName(record)}
                </td>

                {/* Blood Pressure */}
                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                  {getValue(
                    record.bloodPressure
                  )}
                </td>

                {/* Weight */}
                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                  {record.weight !== null &&
                  record.weight !== undefined &&
                  record.weight !== ""
                    ? `${record.weight} kg`
                    : "-"}
                </td>

                {/* Temperature */}
                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                  {getTemperature(
                    record.temperature
                  )}
                </td>

                {/* Hemoglobin */}
                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                  {record.hemoglobin !== null &&
                  record.hemoglobin !== undefined &&
                  record.hemoglobin !== ""
                    ? `${record.hemoglobin} g/dL`
                    : "-"}
                </td>

                {/* Diagnosis */}
                <td className="max-w-xs px-4 py-4 text-sm text-gray-700">
                  <div
                    className="truncate"
                    title={
                      record.diagnosis || "-"
                    }
                  >
                    {getValue(
                      record.diagnosis
                    )}
                  </div>
                </td>

                {/* Prescription */}
                <td className="max-w-xs px-4 py-4 text-sm text-gray-700">
                  <div
                    className="truncate"
                    title={
                      record.prescription || "-"
                    }
                  >
                    {getValue(
                      record.prescription
                    )}
                  </div>
                </td>

                {/* Sync Status */}
                <td className="whitespace-nowrap px-4 py-4">
                  {getSyncStatusBadge(
                    record.syncStatus
                  )}
                </td>

                {/* Actions */}
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* View */}
                    {onView && (
                      <button
                        type="button"
                        onClick={() =>
                          onView(record)
                        }
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                    )}

                    {/* Edit */}
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(record)
                        }
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                    )}

                    {/* Delete */}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(record)
                        }
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HealthRecordTable;
