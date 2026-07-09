import React, { useEffect, useState } from "react";
import { X, PackagePlus } from "lucide-react";

export default function RestockMedicine({
  open,
  medicine,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (open) {
      setQuantity("");
    }
  }, [open]);

  if (!open || !medicine) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      id: medicine.id,
      quantity: Number(quantity),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <PackagePlus className="text-blue-600" size={22} />
            <h2 className="text-xl font-bold">
              Restock Medicine
            </h2>
          </div>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">

            {/* Medicine */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Medicine
              </label>

              <div className="rounded-lg border bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-900">
                  {medicine.name}
                </p>

                <p className="text-sm text-slate-500">
                  {medicine.type} • {medicine.batch}
                </p>
              </div>
            </div>

            {/* Current Stock */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Current Stock
              </label>

              <div className="rounded-lg border bg-slate-50 px-4 py-3 font-semibold">
                {Number(medicine.stock).toLocaleString()} Units
              </div>
            </div>

            {/* Add Stock */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Quantity to Add
              </label>

              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>

            {/* Preview */}
            {quantity && (
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-slate-700">
                  Updated Stock
                </p>

                <p className="mt-1 text-xl font-bold text-blue-700">
                  {Number(medicine.stock) + Number(quantity)} Units
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Updating..." : "Restock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}