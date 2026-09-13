import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import axiosClient from "../../api/axiosClient";
import { updateVisit } from "../../redux/slices/visitSlice";
import { getErrorMessage, normalizeApiError } from "../../utils/apiError";
import { useToast } from "../common/toastContext";

const EditVisit = () => {

  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [beneficiaryName, setBeneficiaryName] = useState("");

  const [formData, setFormData] = useState({
    beneficiaryId: "",
    visitType: "",
    status: "",
    notes: ""
  });

  useEffect(() => {
    let isActive = true;

    const fetchVisit = async () => {

      try {

        const res = await axiosClient.get(`/visits/${id}`);

        if (!isActive) {
          return;
        }

        setBeneficiaryName(
          res.data.beneficiaryName || "-"
        );

        setFormData({
          beneficiaryId: res.data.beneficiaryId,
          visitType: res.data.visitType,
          status: res.data.status,
          notes: res.data.notes || ""
        });

      } catch (err) {

        if (!isActive) {
          return;
        }

        showToast({
          type: "error",
          title: "Visit Not Loaded",
          message: getErrorMessage(
            normalizeApiError(err, "Failed to load visit.")
          ),
        });

      } finally {

        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchVisit();

    return () => {
      isActive = false;
    };
  }, [id, showToast]);

  const handleChange = (e) => {

    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setSaving(true);

    try {

      await dispatch(
        updateVisit({
          id,
          visitData: formData
        })
      ).unwrap();

      showToast({
        type: "success",
        title: "Visit Updated",
        message: "The visit details have been updated successfully.",
      });

      navigate("/app/visit");

    } catch (err) {

      showToast({
        type: "error",
        title: "Update Failed",
        message: getErrorMessage(err, "Failed to update visit."),
      });

    } finally {

      setSaving(false);
    }
  };

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full" />

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Edit Visit
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Update beneficiary visit information
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Beneficiary Name */}

          <div>

            <label className="block mb-2 font-medium">
              Beneficiary
            </label>

            <input
              type="text"
              value={beneficiaryName}
              readOnly
              className="w-full border rounded-xl px-4 py-3 bg-gray-100 text-gray-700 cursor-not-allowed"
            />

          </div>


          {/* Visit Type */}

          <div>

            <label className="block mb-2 font-medium">
              Visit Type
            </label>

            <select
              name="visitType"
              value={formData.visitType}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            >

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

            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
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


          {/* Notes */}

          <div>

            <label className="block mb-2 font-medium">
              Notes
            </label>

            <textarea
              rows="4"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />

          </div>


          {/* Buttons */}

          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={() => navigate("/app/visit")}
              className="px-6 py-3 border rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
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
