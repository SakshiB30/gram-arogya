import React from "react";
import { Filter } from "lucide-react";
import InventoryTableRow from "./InventoryTableRow";

export default function InventoryTable({
  medicines = [],
  loading = false,
  onFilter,
  onEdit,
  onRestock,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-lg font-bold text-slate-900">
          Current Stock Levels
        </h2>

        <button
          onClick={onFilter}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <Filter size={15} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3 font-semibold">
                Medicine Name
              </th>

              <th className="px-6 py-3 font-semibold">
                Available Stock
              </th>

              <th className="px-6 py-3 font-semibold">
                Expiry Date
              </th>

              <th className="px-6 py-3 font-semibold">
                Status
              </th>

              <th className="px-6 py-3 text-right font-semibold">
                Actions
              </th>
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
                  No medicines found.
                </td>
              </tr>
            ) : (
              medicines.map((medicine) => (
                <InventoryTableRow
                  key={medicine.id}
                  medicine={medicine}
                  onEdit={onEdit}
                  onRestock={onRestock}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}