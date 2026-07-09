import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialState = {
  name: "",
  type: "",
  batch: "",
  stock: "",
  expiryDate: "",
  status: "Available",
};

export default function AddMedicine({
  open,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (open) {
      setFormData(initialState);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      stock: Number(formData.stock),
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold text-slate-900">
            Add Medicine
          </h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            {/* Medicine Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Medicine Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>

            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Type
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-600"
              >
                <option value="">Select Type</option>
                <option>Tablet</option>
                <option>Capsule</option>
                <option>Syrup</option>
                <option>Injection</option>
                <option>Powder</option>
                <option>Drops</option>
              </select>
            </div>

            {/* Batch */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Batch Number
              </label>

              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Stock Quantity
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>

            {/* Expiry */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Expiry Date
              </label>

              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-600"
              >
                <option>Available</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2 font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Add Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}