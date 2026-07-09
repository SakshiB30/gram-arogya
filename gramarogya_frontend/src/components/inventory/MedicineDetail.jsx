import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, PackagePlus } from "lucide-react";

import { getMedicineById } from "../../redux/slices/inventorySlice";

const STATUS_STYLES = {
  Available: "bg-green-100 text-green-700",
  "Low Stock": "bg-yellow-100 text-yellow-700",
  "Out of Stock": "bg-red-100 text-red-700",
};

export default function MedicineDetail() {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { medicine, loading, error } = useSelector(
  (state) => state.inventory
);

useEffect(() => {
  if (id) {
    dispatch(getMedicineById(id));
  }
}, [dispatch, id]);

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">
        Loading medicine...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-100 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">
        Medicine not found.
      </div>
    );
  }


  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/app/inventory")}
            className="rounded-lg border p-2 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-3xl font-bold">
              Medicine Details
            </h1>

            <p className="text-slate-500">
              View complete medicine information.
            </p>
          </div>

        </div>

        <div className="flex gap-3">

          <button
            onClick={() =>
              navigate(`/app/inventory/edit/${medicine.id}`)
            }
            className="flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
          >
            <Pencil size={18} />
            Edit
          </button>

          <button
            onClick={() =>
              navigate(`/app/inventory/restock/${medicine.id}`)
            }
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <PackagePlus size={18} />
            Restock
          </button>

        </div>

      </div>

      {/* Details Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div>
            <label className="text-sm font-medium text-slate-500">
              Medicine Name
            </label>

            <p className="mt-2 text-lg font-semibold">
              {medicine.name}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-500">
              Type
            </label>

            <p className="mt-2">
              {medicine.type}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-500">
              Batch Number
            </label>

            <p className="mt-2">
              {medicine.batch}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-500">
              Available Stock
            </label>

            <p className="mt-2 font-semibold">
              {medicine.stock} Units
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-500">
              Expiry Date
            </label>

            <p className="mt-2">
              {medicine.expiryDate}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-500">
              Status
            </label>

            <div className="mt-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  STATUS_STYLES[medicine.status]
                }`}
              >
                {medicine.status}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-500">
              Created At
            </label>

            <p className="mt-2">
              {medicine.createdAt}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-500">
              Last Updated
            </label>

            <p className="mt-2">
              {medicine.updatedAt}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}