import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBeneficiary } from "../../redux/slices/beneficiarySlice";
import { ArrowLeft, Save } from "lucide-react";


export default function AddBeneficiary() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.beneficiaries
  );

  const BENEFICIARY_CATEGORIES = [
  "Pregnant Woman",
  "Child",
  "TB Patient",
  "Elderly",
];

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(createBeneficiary(form));

    if (createBeneficiary.fulfilled.match(result)) {
      navigate("/app/beneficiaries");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Add Beneficiary
          </h1>

          <p className="text-slate-500 mt-1">
            Register a new beneficiary into the system.
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Age
            </label>

            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Gender
            </label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Village */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Village
            </label>

            <input
              name="village"
              value={form.village}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category
            </label>

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
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
    "
>
    <option value="">
        Select Category
    </option>

    <option value="Pregnant Woman">
        Pregnant Woman
    </option>

    <option value="Child">
        Child
    </option>

    <option value="TB Patient">
        TB Patient
    </option>

    <option value="Elderly">
        Elderly
    </option>
</select>
          </div>

          {/* Disease */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Disease
            </label>

            <input
              name="disease"
              value={form.disease}
              onChange={handleChange}
              placeholder="Diabetes"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

        </div>

        {/* Address */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">
            Address
          </label>

          <textarea
            rows="4"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-lg bg-red-100 border border-red-300 p-3 text-red-700">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8">

          <button
            type="button"
            onClick={() => navigate("/app/beneficiaries")}
            className="rounded-lg border border-slate-300 px-6 py-2.5 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <Save size={18} />

            {loading ? "Saving..." : "Save Beneficiary"}
          </button>

        </div>

      </form>
    </div>
  );
}