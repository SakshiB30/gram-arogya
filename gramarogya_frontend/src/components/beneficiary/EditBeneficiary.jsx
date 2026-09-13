import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchBeneficiaryById,
  fetchAvailableAshas,
  updateBeneficiary,
} from "../../redux/slices/beneficiarySlice";
import { getErrorMessage } from "../../utils/apiError";
import { useToast } from "../common/toastContext";

export default function EditBeneficiary() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();

  const { selectedBeneficiary, loading, error, availableAshas } = useSelector(
    (state) => state.beneficiaries
  );

  const user = useSelector((state) => state.auth.user);

  const isANM = user?.role === "ANM";

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    village: "",
    ashaId: "",
    address: "",
    category: "",
    disease: "",
    status: "Active",
  });

  // Load beneficiary
  useEffect(() => {
    dispatch(fetchBeneficiaryById(id));
  }, [dispatch, id]);

  // Fetch ASHAs supervised by the logged-in ANM
  useEffect(() => {
    if (isANM) {
      dispatch(fetchAvailableAshas());
    }
  }, [dispatch, isANM]);

  // Fill form when beneficiary data arrives
  useEffect(() => {
    if (selectedBeneficiary) {
      const timeoutId = window.setTimeout(() => {
        setForm({
        name: selectedBeneficiary.name || "",
        age: selectedBeneficiary.age || "",
        gender: selectedBeneficiary.gender || "",
        phone: selectedBeneficiary.phone || "",
        village: selectedBeneficiary.village || "",
        ashaId: selectedBeneficiary.ashaId || "",
        address: selectedBeneficiary.address || "",
        category: selectedBeneficiary.category || "",
        disease: selectedBeneficiary.disease || "",
        status: selectedBeneficiary.status || "Active",
        });
      }, 0);

      return () => window.clearTimeout(timeoutId);
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
      showToast({
        type: "success",
        title: "Beneficiary Updated",
        message: "The beneficiary information has been updated successfully.",
      });
      navigate("/app/beneficiaries");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Edit Beneficiary
      </h1>

      {error && (
        <p className="text-red-500 mb-4">
          {getErrorMessage(error)}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <input
          className="border p-2 w-full"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        {/* Age */}
        <input
          className="border p-2 w-full"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />

        {/* Gender */}
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

        {/* Phone */}
        <input
          className="border p-2 w-full"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        {/* Village */}
        <input
          className="border p-2 w-full"
          name="village"
          placeholder="Village"
          value={form.village}
          onChange={handleChange}
        />

        {/* Assign ASHA - ANM only */}
        {isANM && (
          <div>
            <label className="block mb-1 font-medium">
              Assign ASHA
            </label>

            <select
              name="ashaId"
              value={form.ashaId}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            >
              <option value="">Select ASHA</option>

              {availableAshas?.map((asha) => (
                <option key={asha.id} value={asha.id}>
                  {asha.name}
                  {asha.employeeId
                    ? ` (${asha.employeeId})`
                    : ""}
                </option>
              ))}
            </select>

            {availableAshas?.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                No ASHA workers are currently assigned to you.
              </p>
            )}
          </div>
        )}

        {/* Address */}
        <input
          className="border p-2 w-full"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        {/* Category */}
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

        {/* Disease */}
        <input
          className="border p-2 w-full"
          name="disease"
          placeholder="Disease"
          value={form.disease}
          onChange={handleChange}
        />

        {/* Status */}
        <select
          className="border p-2 w-full"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          disabled={
            loading ||
            (isANM && availableAshas?.length === 0)
          }
          className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50"
        >
          {loading
            ? "Updating..."
            : "Update Beneficiary"}
        </button>

      </form>
    </div>
  );
}
