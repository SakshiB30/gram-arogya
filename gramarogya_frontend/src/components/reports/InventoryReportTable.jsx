import React from "react";

export default function InventoryReportTable({
  reports = [],
  loading = false,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-bold text-slate-900">
          Inventory Report
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Medicine inventory, stock levels and expiry information.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="min-w-full text-left text-sm">

          <thead>
            <tr className="border-y border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

              <th className="px-6 py-3">
                Medicine
              </th>

              <th className="px-6 py-3">
                Type
              </th>

              <th className="px-6 py-3">
                Batch
              </th>

              <th className="px-6 py-3">
                Expiry Date
              </th>

              <th className="px-6 py-3">
                Stock
              </th>

              <th className="px-6 py-3">
                Minimum Stock
              </th>

              <th className="px-6 py-3">
                Status
              </th>

            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="7"
                  className="py-12 text-center text-slate-500"
                >
                  Loading inventory...
                </td>
              </tr>

            ) : reports.length === 0 ? (

              <tr>
                <td
                  colSpan="7"
                  className="py-12 text-center text-slate-500"
                >
                  No inventory records found.
                </td>
              </tr>

            ) : (

              reports.map((medicine) => (
                <InventoryReportTableRow
                  key={medicine.id}
                  medicine={medicine}
                />
              ))

            )}

          </tbody>

        </table>

      </div>
    </div>
  );
}


// =====================================================
// ROW
// =====================================================

function InventoryReportTableRow({ medicine }) {

  const statusStyles = {
    AVAILABLE: "bg-green-100 text-green-700",
    LOW_STOCK: "bg-yellow-100 text-yellow-700",
    OUT_OF_STOCK: "bg-red-100 text-red-700",
    EXPIRED: "bg-red-100 text-red-700",

    // In case backend returns display-style values
    Available: "bg-green-100 text-green-700",
    "Low Stock": "bg-yellow-100 text-yellow-700",
    "Out of Stock": "bg-red-100 text-red-700",
    Expired: "bg-red-100 text-red-700",
  };

  return (
    <tr className="border-t border-slate-100 transition hover:bg-slate-50">

      {/* Medicine */}

      <td className="px-6 py-4">
        <p className="font-semibold text-slate-900">
          {medicine.name || "-"}
        </p>
      </td>


      {/* Type */}

      <td className="px-6 py-4 text-slate-700">
        {medicine.type || "-"}
      </td>


      {/* Batch */}

      <td className="px-6 py-4 text-slate-700">
        {medicine.batch || "-"}
      </td>


      {/* Expiry */}

      <td className="whitespace-nowrap px-6 py-4 text-slate-700">
        {medicine.expiryDate || "-"}
      </td>


      {/* Stock */}

      <td className="px-6 py-4">

        <span className="font-semibold text-slate-900">
          {medicine.stock ?? 0}
        </span>

      </td>


      {/* Minimum Stock */}

      <td className="px-6 py-4 text-slate-700">
        {medicine.minimumStock ?? 0}
      </td>


      {/* Status */}

      <td className="px-6 py-4">

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            statusStyles[medicine.status] ||
            "bg-slate-100 text-slate-700"
          }`}
        >
          {formatStatus(medicine.status)}
        </span>

      </td>

    </tr>
  );
}


// =====================================================
// FORMAT STATUS
// =====================================================

function formatStatus(status) {

  if (!status) {
    return "-";
  }

  return status
    .toString()
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}