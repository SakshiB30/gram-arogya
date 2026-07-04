import React, { useState } from "react";
import { Plus, Filter, Archive, AlertTriangle, AlertCircle } from "lucide-react";

const STATUS_STYLES = {
  Available: "bg-green-100 text-green-700",
  "Out of Stock": "bg-red-100 text-red-700",
  "Low Stock": "bg-amber-100 text-amber-700",
};

const STOCK_COLOR = {
  Available: "text-slate-900",
  "Out of Stock": "text-red-600",
  "Low Stock": "text-amber-600",
};

const MEDICINES = [
  {
    name: "Paracetamol 500mg",
    type: "Tablet",
    batch: "Batch #892A",
    stock: "2,450 Units",
    expiry: "Oct 2025",
    status: "Available",
  },
  {
    name: "Amoxicillin 250mg",
    type: "Capsule",
    batch: "Batch #114C",
    stock: "0 Units",
    expiry: "Dec 2024",
    status: "Out of Stock",
  },
  {
    name: "ORS Sachets",
    type: "Powder",
    batch: "Batch #442P",
    stock: "45 Units",
    expiry: "Jun 2026",
    status: "Low Stock",
  },
  {
    name: "Ibuprofen 400mg",
    type: "Tablet",
    batch: "Batch #771B",
    stock: "850 Units",
    expiry: "Jan 2026",
    status: "Available",
  },
];

export default function MedicineInventory() {
  const [medicines, setMedicines] = useState(MEDICINES);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory Status</h1>
          <p className="mt-1 text-slate-500">Manage PHC medicine stock and expiry dates.</p>
        </div>
        <button className="flex items-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          <Plus size={18} />
          Add Medicine
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Total Medicines</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <Archive size={18} className="text-blue-600" />
            </span>
          </div>
          <p className="mt-3 text-4xl font-bold text-slate-900">
            142 <span className="text-base font-normal text-slate-500">Items</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Low Stock</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle size={18} className="text-amber-600" />
            </span>
          </div>
          <p className="mt-3 text-4xl font-bold text-slate-900">
            18{" "}
            <span className="text-base font-normal text-slate-500">Items &lt; 50 units</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Out of Stock</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
              <AlertCircle size={18} className="text-red-600" />
            </span>
          </div>
          <p className="mt-3 text-4xl font-bold text-slate-900">
            3{" "}
            <span className="text-base font-normal text-slate-500">Requires action</span>
          </p>
        </div>
      </div>

      {/* Stock table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Current Stock Levels</h2>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <Filter size={15} />
            Filter
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-t border-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3 font-semibold">Medicine Name</th>
              <th className="px-6 py-3 font-semibold">Available Stock</th>
              <th className="px-6 py-3 font-semibold">Expiry Date</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.name} className="border-t border-slate-100">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">{m.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {m.type} &bull; {m.batch}
                  </p>
                </td>
                <td className={`px-6 py-4 font-semibold ${STOCK_COLOR[m.status]}`}>
                  {m.stock}
                </td>
                <td className="px-6 py-4 text-slate-700">{m.expiry}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[m.status]}`}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {m.status !== "Out of Stock" && (
                    <button className="mr-4 text-sm font-semibold text-blue-600 hover:underline">
                      Edit
                    </button>
                  )}
                  {(m.status === "Out of Stock" || m.status === "Low Stock") && (
                    <button className="text-sm font-semibold text-blue-600 hover:underline">
                      Restock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}