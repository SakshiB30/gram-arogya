import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createVisit } from "../../redux/slices/visitSlice";
import { fetchBeneficiaries } from "../../redux/slices/beneficiarySlice";
import { getErrorMessage } from "../../utils/apiError";
import { useToast } from "../common/toastContext";

const AddVisit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { beneficiaries = [] } = useSelector(
    (state) => state.beneficiaries
  );

  const [formData, setFormData] = useState({
    beneficiaryId: "",
    visitType: "",
    status: "Pending",

    // Date on which ASHA should perform the visit
    scheduledDate: "",

    // Date for future follow-up
    nextVisitDate: "",

    notes: "",
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

    // =========================
    // VALIDATION
    // =========================

    if (!formData.beneficiaryId) {
      showToast({
        type: "warning",
        title: "Beneficiary Required",
        message: "Please select a beneficiary.",
      });
      return;
    }

    if (!formData.visitType) {
      showToast({
        type: "warning",
        title: "Visit Type Required",
        message: "Please select visit type.",
      });
      return;
    }

    if (!formData.scheduledDate) {
      showToast({
        type: "warning",
        title: "Scheduled Date Required",
        message: "Please select scheduled date.",
      });
      return;
    }

    setLoading(true);

    try {
      await dispatch(
        createVisit(formData)
      ).unwrap();

      showToast({
        type: "success",
        title: "Visit Scheduled",
        message:
          "The visit has been successfully scheduled for the beneficiary.",
      });

      navigate("/app/visit");

    } catch (err) {
      showToast({
        type: "error",
        title: "Visit Not Scheduled",
        message: getErrorMessage(err, "Failed to schedule visit."),
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-lg">

        {/* =========================
            HEADER
        ========================= */}

        <h1 className="text-3xl font-bold text-gray-800">
          Schedule New Visit
        </h1>

        <p className="mt-2 mb-8 text-gray-500">
          Schedule a beneficiary visit
        </p>


        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* =========================
              BENEFICIARY
          ========================= */}

          <div>

            <label className="mb-2 block font-medium">
              Beneficiary
            </label>

            <select
              name="beneficiaryId"
              value={formData.beneficiaryId}
              onChange={handleChange}
              required
              className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            >

              <option value="">
                Select Beneficiary
              </option>

              {beneficiaries.map((beneficiary) => (

                <option
                  key={beneficiary.id}
                  value={beneficiary.id}
                >

                  {beneficiary.name}{" "}
                  ({beneficiary.category})

                </option>

              ))}

            </select>

          </div>


          {/* =========================
              VISIT TYPE
          ========================= */}

          <div>

            <label className="mb-2 block font-medium">
              Visit Type
            </label>

            <select
              name="visitType"
              value={formData.visitType}
              onChange={handleChange}
              required
              className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
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


          {/* =========================
              SCHEDULED DATE
          ========================= */}

          <div>

            <label className="mb-2 block font-medium">
              Scheduled Date
            </label>

            <input
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              required
              className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

            <p className="mt-1 text-sm text-gray-500">
              The visit will appear in Today's Schedule on this date.
            </p>

          </div>


          {/* =========================
              STATUS
          ========================= */}

          <div>

            <label className="mb-2 block font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
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


          {/* =========================
              NEXT VISIT DATE
          ========================= */}

          <div>

            <label className="mb-2 block font-medium">
              Next Visit Date
            </label>

            <input
              type="date"
              name="nextVisitDate"
              value={formData.nextVisitDate}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

            <p className="mt-1 text-sm text-gray-500">
              Optional. Use this when another follow-up visit is required.
            </p>

          </div>


          {/* =========================
              NOTES
          ========================= */}

          <div>

            <label className="mb-2 block font-medium">
              Notes
            </label>

            <textarea
              rows={4}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add visit instructions or notes..."
              className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </div>


          {/* =========================
              BUTTONS
          ========================= */}

          <div className="flex justify-end gap-4 pt-2">

            <button
              type="button"
              onClick={() => navigate("/app/visit")}
              disabled={loading}
              className="
                rounded-xl
                border
                px-6
                py-3
                hover:bg-gray-50
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-xl
                bg-blue-600
                px-6
                py-3
                text-white
                hover:bg-blue-700
                disabled:bg-gray-400
              "
            >

              {loading
                ? "Scheduling..."
                : "Schedule Visit"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddVisit;
