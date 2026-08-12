import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  PackageMinus,
} from "lucide-react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getMedicineById,
  issueMedicine,
} from "../../redux/slices/inventorySlice";

const initialState = {
  beneficiaryId: "",
  beneficiaryName: "",
  quantity: "",
  reason: "",
};

export default function IssueMedicine() {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    medicine,
    loading,
    error,
  } = useSelector(
    (state) => state.inventory
  );

  const [formData, setFormData] =
    useState(initialState);

  // =========================
  // GET MEDICINE
  // =========================
  useEffect(() => {
    if (id) {
      dispatch(getMedicineById(id));
    }
  }, [dispatch, id]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!medicine) {
      return;
    }

    const quantity = Number(
      formData.quantity
    );

    // Prevent invalid quantity
    if (quantity <= 0) {
      return;
    }

    // Prevent issuing more than available
    if (quantity > medicine.stock) {
      alert(
        `Only ${medicine.stock} units are available.`
      );
      return;
    }

    const issueData = {
      beneficiaryId:
        formData.beneficiaryId.trim(),

      beneficiaryName:
        formData.beneficiaryName.trim(),

      quantity,

      reason:
        formData.reason.trim(),
    };

    const result = await dispatch(
      issueMedicine({
        id,
        issueData,
      })
    );

    // Navigate only when API succeeds
    if (issueMedicine.fulfilled.match(result)) {
      navigate("/app/inventory");
    }
  };

  // =========================
  // LOADING MEDICINE
  // =========================
  if (loading && !medicine) {
    return (
      <div className="p-6 text-center text-slate-500">
        Loading medicine...
      </div>
    );
  }

  // =========================
  // MEDICINE NOT FOUND
  // =========================
  if (!medicine) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          Medicine not found.
        </p>

        <button
          onClick={() =>
            navigate("/app/inventory")
          }
          className="mt-4 rounded-lg border px-4 py-2"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* =========================
          HEADER
      ========================== */}
      <div className="mb-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            navigate("/app/inventory")
          }
          className="rounded-lg border p-2 hover:bg-slate-100"
        >
          <ArrowLeft size={18} />
        </button>

        <PackageMinus
          size={28}
          className="text-orange-600"
        />

        <div>
          <h1 className="text-2xl font-bold">
            Issue Medicine
          </h1>

          <p className="text-slate-500">
            Issue medicine to a beneficiary.
          </p>
        </div>
      </div>

      {/* =========================
          ERROR
      ========================== */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* =========================
          FORM
      ========================== */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm"
      >
        {/* =========================
            MEDICINE
        ========================== */}
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

        {/* =========================
            AVAILABLE STOCK
        ========================== */}
        <div>
          <label className="mb-2 block font-medium">
            Available Stock
          </label>

          <input
            disabled
            value={`${medicine.stock || 0} Units`}
            className="w-full rounded-lg border bg-slate-100 px-3 py-2"
          />
        </div>

        {/* =========================
            BENEFICIARY ID
        ========================== */}
        <div>
          <label className="mb-2 block font-medium">
            Beneficiary ID
          </label>

          <input
            type="text"
            name="beneficiaryId"
            value={formData.beneficiaryId}
            onChange={handleChange}
            required
            placeholder="Enter beneficiary ID"
            className="w-full rounded-lg border px-3 py-2 focus:border-blue-600 focus:outline-none"
          />
        </div>

        {/* =========================
            BENEFICIARY NAME
        ========================== */}
        <div>
          <label className="mb-2 block font-medium">
            Beneficiary Name
          </label>

          <input
            type="text"
            name="beneficiaryName"
            value={formData.beneficiaryName}
            onChange={handleChange}
            required
            placeholder="Enter beneficiary name"
            className="w-full rounded-lg border px-3 py-2 focus:border-blue-600 focus:outline-none"
          />
        </div>

        {/* =========================
            QUANTITY
        ========================== */}
        <div>
          <label className="mb-2 block font-medium">
            Quantity to Issue
          </label>

          <input
            type="number"
            name="quantity"
            min="1"
            max={medicine.stock}
            value={formData.quantity}
            onChange={handleChange}
            required
            placeholder="Enter quantity"
            className="w-full rounded-lg border px-3 py-2 focus:border-blue-600 focus:outline-none"
          />

          <p className="mt-1 text-sm text-slate-500">
            Maximum available:{" "}
            {medicine.stock} units
          </p>
        </div>

        {/* =========================
            REASON
        ========================== */}
        <div>
          <label className="mb-2 block font-medium">
            Reason
          </label>

          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Enter reason for issuing medicine"
            className="w-full rounded-lg border px-3 py-2 focus:border-blue-600 focus:outline-none"
          />
        </div>

        {/* =========================
            PREVIEW
        ========================== */}
        {formData.quantity &&
          Number(formData.quantity) > 0 && (
            <div className="rounded-lg bg-orange-50 p-4">
              <p className="text-sm text-slate-600">
                Remaining Stock
              </p>

              <h2 className="mt-1 text-2xl font-bold text-orange-700">
                {Number(medicine.stock) -
                  Number(formData.quantity)}{" "}
                Units
              </h2>
            </div>
          )}

        {/* =========================
            BUTTONS
        ========================== */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() =>
              navigate("/app/inventory")
            }
            className="rounded-lg border px-6 py-2 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              loading ||
              Number(formData.quantity) >
                Number(medicine.stock)
            }
            className="rounded-lg bg-orange-600 px-6 py-2 text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Issuing..."
              : "Issue Medicine"}
          </button>
        </div>
      </form>
    </div>
  );
}
