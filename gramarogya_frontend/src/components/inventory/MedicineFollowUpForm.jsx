import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  createMedicineFollowUp,
  getFollowUpsByBeneficiary,
} from "../../redux/slices/medicineFollowUpSlice";
import { getErrorMessage } from "../../utils/apiError";
import { useToast } from "../common/toastContext";

const MedicineFollowUpForm = ({
  beneficiaryId,
  visitId,
}) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const showValidationToast = (message) => {
    showToast({
      type: "warning",
      title: "Required Field",
      message,
    });
  };

  const [formData, setFormData] = useState({
    medicineTaken: "",
    symptomStatus: "",
    sideEffects: "",
    sideEffectDetails: "",
    remarks: "",
    needsDoctorVisit: false,
    referralReason: "",
  });

  const [loading, setLoading] = useState(false);


  // ==================================================
  // HANDLE INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ==================================================
  // HANDLE DOCTOR VISIT CHANGE
  // ==================================================

  const handleDoctorVisitChange = (e) => {

    const needsDoctorVisit = e.target.value === "true";

    setFormData((prev) => ({
      ...prev,
      needsDoctorVisit,
      referralReason: needsDoctorVisit
        ? prev.referralReason
        : "",
    }));
  };


  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // -------------------------------
    // Validation
    // -------------------------------

    if (!formData.medicineTaken) {
      showValidationToast("Please select medicine adherence.");
      return;
    }

    if (!formData.symptomStatus) {
      showValidationToast("Please select symptom status.");
      return;
    }

    if (!formData.sideEffects) {
      showValidationToast("Please select side effect status.");
      return;
    }

    if (
      formData.needsDoctorVisit &&
      !formData.referralReason.trim()
    ) {
      showValidationToast("Please enter referral reason.");
      return;
    }


    setLoading(true);

    try {

      const payload = {
        beneficiaryId,
        visitId,

        medicineTaken: formData.medicineTaken,
        symptomStatus: formData.symptomStatus,
        sideEffects: formData.sideEffects,

        sideEffectDetails:
          formData.sideEffectDetails.trim(),

        remarks:
          formData.remarks.trim(),

        needsDoctorVisit:
          formData.needsDoctorVisit,

        referralReason:
          formData.needsDoctorVisit
            ? formData.referralReason.trim()
            : "",
      };


      // ==================================================
      // CREATE FOLLOW-UP
      // ==================================================

      await dispatch(
        createMedicineFollowUp(payload)
      ).unwrap();


      showToast({
        type: "success",
        title: "Follow-Up Recorded",
        message: "The medicine follow-up has been recorded successfully.",
      });


      // ==================================================
      // REFRESH FOLLOW-UP HISTORY
      // ==================================================

      if (beneficiaryId) {
        dispatch(
          getFollowUpsByBeneficiary(beneficiaryId)
        );
      }


      // ==================================================
      // RESET FORM
      // ==================================================

      setFormData({
        medicineTaken: "",
        symptomStatus: "",
        sideEffects: "",
        sideEffectDetails: "",
        remarks: "",
        needsDoctorVisit: false,
        referralReason: "",
      });

    } catch (error) {

      showToast({
        type: "error",
        title: "Follow-Up Not Recorded",
        message: getErrorMessage(
          error,
          "Failed to record medicine follow-up."
        ),
      });

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="mt-8 bg-white rounded-3xl shadow-xl p-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-gray-800">
          Medicine Follow-Up
        </h2>

        <p className="text-gray-500 mt-1">
          Record the beneficiary's response to the medicine
        </p>

      </div>


      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >


        {/* ==================================================
            MEDICINE TAKEN
        ================================================== */}

        <div>

          <label className="block mb-2 font-medium text-gray-700">
            Did the beneficiary take the medicine?
          </label>

          <select
            name="medicineTaken"
            value={formData.medicineTaken}
            onChange={handleChange}
            required
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >

            <option value="">
              Select
            </option>

            <option value="YES">
              Yes
            </option>

            <option value="NO">
              No
            </option>

            <option value="PARTIALLY">
              Partially
            </option>

            <option value="UNKNOWN">
              Unknown
            </option>

          </select>

        </div>


        {/* ==================================================
            SYMPTOM STATUS
        ================================================== */}

        <div>

          <label className="block mb-2 font-medium text-gray-700">
            How are the symptoms?
          </label>

          <select
            name="symptomStatus"
            value={formData.symptomStatus}
            onChange={handleChange}
            required
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >

            <option value="">
              Select
            </option>

            <option value="IMPROVING">
              Improving
            </option>

            <option value="SAME">
              Same
            </option>

            <option value="WORSE">
              Worse
            </option>

          </select>

        </div>


        {/* ==================================================
            SIDE EFFECTS
        ================================================== */}

        <div>

          <label className="block mb-2 font-medium text-gray-700">
            Side effects
          </label>

          <select
            name="sideEffects"
            value={formData.sideEffects}
            onChange={handleChange}
            required
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >

            <option value="">
              Select
            </option>

            <option value="NONE">
              None
            </option>

            <option value="MILD">
              Mild
            </option>

            <option value="MODERATE">
              Moderate
            </option>

            <option value="SEVERE">
              Severe
            </option>

          </select>

        </div>


        {/* ==================================================
            SIDE EFFECT DETAILS
        ================================================== */}

        {formData.sideEffects &&
          formData.sideEffects !== "NONE" && (

            <div>

              <label className="block mb-2 font-medium text-gray-700">
                Side-effect details
              </label>

              <textarea
                name="sideEffectDetails"
                value={formData.sideEffectDetails}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the side effects..."
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>
          )}


        {/* ==================================================
            REMARKS
        ================================================== */}

        <div>

          <label className="block mb-2 font-medium text-gray-700">
            Remarks
          </label>

          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows={4}
            placeholder="Add observations or remarks..."
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>


        {/* ==================================================
            DOCTOR VISIT
        ================================================== */}

        <div>

          <label className="block mb-2 font-medium text-gray-700">
            Does the beneficiary need another doctor visit?
          </label>

          <select
            value={formData.needsDoctorVisit}
            onChange={handleDoctorVisitChange}
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >

            <option value="false">
              No
            </option>

            <option value="true">
              Yes
            </option>

          </select>

        </div>


        {/* ==================================================
            REFERRAL REASON
        ================================================== */}

        {formData.needsDoctorVisit && (

          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Referral Reason
            </label>

            <textarea
              name="referralReason"
              value={formData.referralReason}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Why does the beneficiary need another doctor visit?"
              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </div>
        )}


        {/* ==================================================
            BUTTONS
        ================================================== */}

        <div className="flex justify-end gap-4 pt-4">

          <button
            type="button"
            onClick={() => navigate("/app/visit")}
            disabled={loading}
            className="
              px-6
              py-3
              border
              rounded-xl
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
              px-6
              py-3
              bg-blue-600
              hover:bg-blue-700
              text-white
              rounded-xl
              disabled:bg-gray-400
            "
          >

            {loading
              ? "Saving..."
              : "Record Follow-Up"}

          </button>

        </div>

      </form>

    </div>
  );
};

export default MedicineFollowUpForm;
