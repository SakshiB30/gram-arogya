import React, { useEffect, useState } from "react";
import { PackagePlus, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  getMedicineById,
  receiveMedicine,
} from "../../redux/slices/inventorySlice";

export default function ReceiveMedicine() {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { medicine, loading, error } = useSelector(
    (state) => state.inventory
  );

  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getMedicineById(id));
    }
  }, [dispatch, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quantity || Number(quantity) <= 0) {
      return;
    }

    const result = await dispatch(
      receiveMedicine({
        id,
        quantity: Number(quantity),
      })
    );

    if (receiveMedicine.fulfilled.match(result)) {
      navigate("/app/inventory");
    }
  };

  if (loading && !medicine) {
    return (
      <div className="p-6 text-center text-slate-500">
        Loading medicine...
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          Medicine not found.
        </p>

        <button
          onClick={() => navigate("/app/inventory")}
          className="mt-4 rounded-lg border px-4 py-2"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => navigate("/app/inventory")}
          className="rounded-lg border p-2 hover:bg-slate-100"
        >
          <ArrowLeft size={18} />
        </button>

        <PackagePlus
          size={28}
          className="text-blue-600"
        />

        <div>
          <h1 className="text-2xl font-bold">
            Restock Medicine
          </h1>

          <p className="text-slate-500">
            Increase available stock.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm"
      >
        {/* Medicine */}
        <div>
          <label className="mb-2 block font-medium">
            Medicine
          </label>

          <div className="rounded-lg border bg-slate-50 p-4">
            <p className="font-semibold">
              {medicine.name}
            </p>

            <p className="text-sm text-slate-500">
              {medicine.type} • {medicine.batch}
            </p>
          </div>
        </div>

        {/* Current Stock */}
        <div>
          <label className="mb-2 block font-medium">
            Current Stock
          </label>

          <input
            disabled
            value={`${medicine.stock || 0} Units`}
            className="w-full rounded-lg border bg-slate-100 px-3 py-2"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="mb-2 block font-medium">
            Quantity to Add
          </label>

          <input
            type="number"
            min="1"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:border-blue-600 focus:outline-none"
            placeholder="Enter quantity"
          />
        </div>

        {/* Preview */}
        {quantity && Number(quantity) > 0 && (
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-slate-600">
              Updated Stock
            </p>

            <h2 className="mt-1 text-2xl font-bold text-blue-700">
              {Number(medicine.stock || 0) +
                Number(quantity)}{" "}
              Units
            </h2>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/app/inventory")}
            className="rounded-lg border px-6 py-2 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Restock"}
          </button>
        </div>
      </form>
    </div>
  );
}