import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createVisit } from "../../redux/slices/visitSlice";
import { fetchBeneficiaries } from "../../redux/slices/beneficiarySlice";

const AddVisit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { beneficiaries = [] } = useSelector(
    (state) => state.beneficiaries
  );

  const [formData, setFormData] = useState({
    beneficiaryId: "",
    visitType: "",
    status: "Pending",
    notes: "",
    nextVisitDate: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchBeneficiaries());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await dispatch(createVisit(formData)).unwrap();

      alert("Visit created successfully");

      navigate("/app/visit");
    } catch (err) {
      alert(err || "Failed to create visit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">
          Add New Visit
        </h1>

        <p className="mt-2 mb-8 text-gray-500">
          Create beneficiary visit record
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Beneficiary */}
          <div>
            <label className="mb-2 block font-medium">
              Beneficiary
            </label>

            <select
              name="beneficiaryId"
              value={formData.beneficiaryId}
              onChange={handleChange}
              required
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="">
                Select Beneficiary
              </option>

              {beneficiaries.map((beneficiary) => (
                <option
                  key={beneficiary.id}
                  value={beneficiary.id}
                >
                  {beneficiary.name} ({beneficiary.category})
                </option>
              ))}
            </select>
          </div>

          {/* Visit Type */}
          <div>
            <label className="mb-2 block font-medium">
              Visit Type
            </label>

            <select
              name="visitType"
              value={formData.visitType}
              onChange={handleChange}
              required
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="">
                Select Visit Type
              </option>

              <option value="Home Visit">
                Home Visit
              </option>

              <option value="Follow Up">
                Follow Up
              </option>

              <option value="Vaccination">
                Vaccination
              </option>

              <option value="ANC Checkup">
                ANC Checkup
              </option>

              <option value="PNC Visit">
                PNC Visit
              </option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="Pending">
                Pending
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          {/* Next Visit Date */}
          <div>
            <label className="mb-2 block font-medium">
              Next Visit Date
            </label>

            <input
              type="date"
              name="nextVisitDate"
              value={formData.nextVisitDate}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block font-medium">
              Notes
            </label>

            <textarea
              rows={4}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/app/visit")}
              className="rounded-xl border px-6 py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Visit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVisit;