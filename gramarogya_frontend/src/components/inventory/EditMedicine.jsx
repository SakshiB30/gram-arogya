import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  getMedicineById,
  updateMedicine,
} from "../../redux/slices/inventorySlice";

const initialState = {
  name: "",
  type: "",
  batch: "",
  stock: "",
  expiryDate: "",
  minimumStock: "",
};

export default function EditMedicine() {
  const { id } = useParams();
  console.log("ID:", id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { medicine, loading } = useSelector(
    (state) => state.inventory
  );

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
  dispatch(getMedicineById(id)).then((res) => {
    console.log("Thunk result:", res);
  });
}, [dispatch, id]);

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name || "",
        type: medicine.type || "",
        batch: medicine.batch || "",
        stock: medicine.stock || "",
        expiryDate: medicine.expiryDate || "",
      });
    }
  }, [medicine]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const medicineData = {
    ...formData,
    stock: Number(formData.stock),
    minimumStock: Number(formData.minimumStock),
  };

  await dispatch(
    updateMedicine({
      id,
      medicineData,
    })
  );

  navigate("/app/inventory");
};

  return (
    <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Edit Medicine
        </h1>

        <p className="mt-2 text-slate-500">
          Update medicine information.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block font-medium">
              Medicine Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
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

          <div>
            <label className="mb-2 block font-medium">
              Batch Number
            </label>

            <input
              type="text"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Stock Quantity
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Expiry Date
            </label>

            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

        </div>

        <div className="mt-8 flex justify-end gap-4">

          <button
            type="button"
            onClick={() => navigate("/app/inventory")}
            className="rounded-lg border px-6 py-3"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update Medicine"}
          </button>

        </div>
      </form>

    </div>
  );
}
