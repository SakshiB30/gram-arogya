import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createVisit } from "../../redux/slices/visitSlice";


const AddVisit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    beneficiaryId: "",
    visitType: "",
    status: "Pending",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

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
      navigate("/app/visit");
    } catch (err) {
      alert(err || "Failed to create visit");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Add New Visit
          </h1>

          <p className="text-gray-500 mt-2">
            Create a new beneficiary visit record.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Beneficiary ID */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Beneficiary ID
            </label>

            <input
              type="text"
              name="beneficiaryId"
              value={formData.beneficiaryId}
              onChange={handleChange}
              required
              placeholder="Enter Beneficiary ID"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Visit Type */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Visit Type
            </label>

            <select
              name="visitType"
              value={formData.visitType}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Visit Type</option>
              <option value="Home Visit">Home Visit</option>
              <option value="Follow Up">Follow Up</option>
              <option value="Vaccination">Vaccination</option>
              <option value="ANC Checkup">ANC Checkup</option>
              <option value="PNC Visit">PNC Visit</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Notes
            </label>

            <textarea
              rows="4"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter notes..."
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/app/visit")}
              className="px-6 py-3 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-60"
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