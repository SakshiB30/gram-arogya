import React from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InventoryHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Inventory Status
        </h1>

        <p className="mt-1 text-slate-500">
          Manage PHC medicine stock and expiry dates.
        </p>
      </div>

      <button
        onClick={() => navigate("/app/inventory/add")}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
      >
        <Plus size={18} />
        Add Medicine
      </button>
    </div>
  );
}