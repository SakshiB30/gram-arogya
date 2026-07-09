import React, { useEffect, useState } from "react";
import { PackagePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  getMedicineById,
  restockMedicine,
} from "../../redux/slices/inventorySlice";

export default function RestockMedicine() {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { medicine, loading } = useSelector(
    (state) => state.inventory
  );

  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    dispatch(getMedicineById(id));
  }, [dispatch, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      restockMedicine({
        id,
        quantity: Number(quantity),
      })
    );

    navigate("/app/inventory");
  };

  if (!medicine) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">
        Loading medicine...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">

      <div className="mb-8 flex items-center gap-3">
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

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
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
              {medicine.type} •{" "}
              {medicine.batch}
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
            value={`${medicine.stock} Units`}
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
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Preview */}
        {quantity && (
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-slate-600">
              Updated Stock
            </p>

            <h2 className="mt-1 text-2xl font-bold text-blue-700">
              {Number(medicine.stock) +
                Number(quantity)}{" "}
              Units
            </h2>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() =>
              navigate("/app/inventory")
            }
            className="rounded-lg border px-6 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Restock"}
          </button>
        </div>
      </form>
    </div>
  );
}