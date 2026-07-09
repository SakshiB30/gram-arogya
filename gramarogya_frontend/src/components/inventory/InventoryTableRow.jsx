import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, PackagePlus, Trash2 } from "lucide-react";

const STATUS_STYLES = {
  Available: "bg-green-100 text-green-700",
  "Low Stock": "bg-yellow-100 text-yellow-700",
  "Out of Stock": "bg-red-100 text-red-700",
};

const STOCK_COLOR = {
  Available: "text-slate-900",
  "Low Stock": "text-yellow-600",
  "Out of Stock": "text-red-600",
};

export default function InventoryTableRow({
  medicine,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50">
      {/* Medicine */}
      <td className="px-6 py-4">
        <p className="font-semibold text-slate-900">
          {medicine.name}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {medicine.type} • {medicine.batch}
        </p>
      </td>

      {/* Stock */}
      <td
        className={`px-6 py-4 font-semibold ${
          STOCK_COLOR[medicine.status]
        }`}
      >
        {medicine.stock} Units
      </td>

      {/* Expiry */}
      <td className="px-6 py-4">
        {medicine.expiryDate}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            STATUS_STYLES[medicine.status]
          }`}
        >
          {medicine.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">

          <button
            onClick={() =>
              navigate(`/app/inventory/${medicine.id}`)
            }
            className="rounded p-2 hover:bg-slate-100"
          >
            <Eye
  size={18}
  onClick={() =>
    navigate(`/app/inventory/${medicine.id}`)
  }
/>
          </button>

          <button
            onClick={() =>
              navigate(`/app/inventory/edit/${medicine.id}`)
            }
            className="rounded p-2 hover:bg-slate-100"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() =>
              navigate(`/app/inventory/restock/${medicine.id}`)
            }
            className="rounded p-2 hover:bg-slate-100"
          >
            <PackagePlus size={18} />
          </button>

          <button
            onClick={() => onDelete(medicine.id)}
            className="rounded p-2 hover:bg-red-100 text-red-600"
          >
            <Trash2 size={18} />
          </button>

        </div>
      </td>
    </tr>
  );
}