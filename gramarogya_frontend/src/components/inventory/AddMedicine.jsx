import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addMedicine } from "../../redux/slices/inventorySlice";

const initialState = {
  name: "",
  type: "",
  batch: "",
  stock: "",
  expiryDate: "",
};

export default function AddMedicine() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.inventory);

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      addMedicine({
        ...formData,
        stock: Number(formData.stock),
      })
    );

    navigate("/app/inventory");
  };

  return (
    <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Add Medicine
        </h1>

        <p className="mt-2 text-slate-500">
          Add a new medicine to the PHC inventory.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

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
              className="w-full rounded-lg border px-4 py-3 focus:border-blue-600 focus:outline-none"
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
              className="w-full rounded-lg border px-4 py-3 focus:border-blue-600 focus:outline-none"
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
              className="w-full rounded-lg border px-4 py-3 focus:border-blue-600 focus:outline-none"
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
              min="0"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3 focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Expiry Date */}
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
              className="w-full rounded-lg border px-4 py-3 focus:border-blue-600 focus:outline-none"
            />
          </div>

        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/app/inventory")}
            className="rounded-lg border px-6 py-3 font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Medicine"}
          </button>
        </div>
      </form>
    </div>
  );
}

