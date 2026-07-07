import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { updateVisit } from "../../redux/slices/visitSlice";

const EditVisit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    beneficiaryId: "",
    visitType: "",
    status: "",
    notes: "",
  });

  useEffect(() => {
    fetchVisit();
  }, []);

  const fetchVisit = async () => {
    try {
      const res = await axiosClient.get(`/visits/${id}`);

      setFormData({
        beneficiaryId: res.data.beneficiaryId,
        visitType: res.data.visitType,
        status: res.data.status,
        notes: res.data.notes || "",
      });
    } catch (err) {
      alert("Failed to load visit");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await dispatch(
        updateVisit({
          id,
          visitData: formData,
        })
      ).unwrap();

      navigate("/app/visit");
    } catch (err) {
      alert(err || "Failed to update visit");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-2">
          Edit Visit
        </h1>

        <p className="text-gray-500 mb-8">
          Update beneficiary visit information.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block mb-2 font-medium">
              Beneficiary ID
            </label>

            <input
              type="text"
              name="beneficiaryId"
              value={formData.beneficiaryId}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Visit Type
            </label>

            <select
              name="visitType"
              value={formData.visitType}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option>Home Visit</option>
              <option>Follow Up</option>
              <option>Vaccination</option>
              <option>ANC Checkup</option>
              <option>PNC Visit</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option>Pending</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Notes
            </label>

            <textarea
              rows={4}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={() => navigate("/app/visit")}
              className="px-6 py-3 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              {saving ? "Updating..." : "Update Visit"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditVisit;