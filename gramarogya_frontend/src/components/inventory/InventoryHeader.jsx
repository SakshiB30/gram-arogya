import { Plus, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InventoryHeader() {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex items-center justify-between">

      <div>
        <h1 className="text-3xl font-bold">
          Inventory
        </h1>

        <p className="mt-2 text-slate-500">
          Manage medicine inventory.
        </p>
      </div>

      <div className="flex gap-3">

        <button
          onClick={() =>
            navigate("/app/inventory/logs")
          }
          className="flex items-center gap-2 rounded-lg border px-5 py-3 hover:bg-slate-100"
        >
          <History size={18} />
          Stock History
        </button>

        <button
          onClick={() =>
            navigate("/app/inventory/add")
          }
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Medicine
        </button>

      </div>

    </div>
  );
}