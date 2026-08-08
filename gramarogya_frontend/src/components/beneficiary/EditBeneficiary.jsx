import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchBeneficiaryById,
  updateBeneficiary,
} from "../../redux/slices/beneficiarySlice";

export default function EditBeneficiary() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedBeneficiary, loading, error } = useSelector(
    (state) => state.beneficiaries
  );

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    village: "",
    address: "",
    category: "",
    disease: "",
    status: "Active",
  });

  // Load beneficiary
  useEffect(() => {
    dispatch(fetchBeneficiaryById(id));
  }, [dispatch, id]);

  // Fill form when data arrives
  useEffect(() => {
    if (selectedBeneficiary) {
      setForm({
        name: selectedBeneficiary.name || "",
        age: selectedBeneficiary.age || "",
        gender: selectedBeneficiary.gender || "",
        phone: selectedBeneficiary.phone || "",
        village: selectedBeneficiary.village || "",
        address: selectedBeneficiary.address || "",
        category: selectedBeneficiary.category || "",
        disease: selectedBeneficiary.disease || "",
        status: selectedBeneficiary.status || "Active",
      });
    }
  }, [selectedBeneficiary]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      updateBeneficiary({
        id,
        beneficiaryData: form,
      })
    );

    if (updateBeneficiary.fulfilled.match(result)) {
      navigate("/app/beneficiaries");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Edit Beneficiary
      </h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="border p-2 w-full"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          className="border p-2 w-full"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />

        <select
          className="border p-2 w-full"
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          className="border p-2 w-full"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          className="border p-2 w-full"
          name="village"
          placeholder="Village"
          value={form.village}
          onChange={handleChange}
        />

        <input
          className="border p-2 w-full"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <select
    name="category"
    value={form.category}
    onChange={handleChange}
    className="
        w-full
        border
        rounded-lg
        px-3
        py-2
    "
>
    <option value="">Select Category</option>
    <option value="Pregnant Woman">Pregnant Woman</option>
    <option value="Child">Child</option>
    <option value="TB Patient">TB Patient</option>
    <option value="Elderly">Elderly</option>
</select>

        <input
          className="border p-2 w-full"
          name="disease"
          placeholder="Disease"
          value={form.disease}
          onChange={handleChange}
        />

        <select
          className="border p-2 w-full"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          {loading ? "Updating..." : "Update Beneficiary"}
        </button>

      </form>
    </div>
  );
}