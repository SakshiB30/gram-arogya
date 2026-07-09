import React from "react";
import InventoryTableRow from "./InventoryTableRow";

export default function InventoryTable({
  medicines = [],
  loading = false,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Current Stock Levels
          </h2>
          <p className="text-sm text-slate-500">
            Total Medicines: {medicines.length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">

          <thead className="bg-slate-50">
            <tr className="text-sm font-semibold text-slate-600">
              <th className="px-6 py-4">Medicine</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Expiry Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-slate-500"
                >
                  Loading medicines...
                </td>
              </tr>
            ) : medicines.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-slate-500"
                >
                  No medicines available.
                </td>
              </tr>
            ) : (
              medicines.map((medicine) => (
                <InventoryTableRow
                  key={medicine.id}
                  medicine={medicine}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}