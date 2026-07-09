import React from "react";

const STATUS_STYLES = {
  Available: "bg-green-100 text-green-700",
  "Low Stock": "bg-amber-100 text-amber-700",
  "Out of Stock": "bg-red-100 text-red-700",
};

const STOCK_COLOR = {
  Available: "text-slate-900",
  "Low Stock": "text-amber-600",
  "Out of Stock": "text-red-600",
};

export default function InventoryTableRow({
  medicine,
  onEdit,
  onRestock,
}) {
  const {
    id,
    name,
    type,
    batch,
    stock,
    expiryDate,
    status,
  } = medicine;

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
      {/* Medicine */}
      <td className="px-6 py-4">
        <p className="font-semibold text-slate-900">
          {name}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {type} • {batch}
        </p>
      </td>

      {/* Stock */}
      <td
        className={`px-6 py-4 font-semibold ${
          STOCK_COLOR[status] || "text-slate-900"
        }`}
      >
        {Number(stock).toLocaleString()} Units
      </td>

      {/* Expiry */}
      <td className="px-6 py-4 text-slate-700">
        {expiryDate}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            STATUS_STYLES[status] ||
            "bg-slate-100 text-slate-700"
          }`}
        >
          {status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        {status !== "Out of Stock" && (
          <button
            onClick={() => onEdit(medicine)}
            className="mr-4 text-sm font-semibold text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}

        {(status === "Low Stock" ||
          status === "Out of Stock") && (
          <button
            onClick={() => onRestock(medicine)}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Restock
          </button>
        )}
      </td>
    </tr>
  );
}