import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createHealthRecord } from "../../redux/slices/healthRecordSlice";
import { fetchBeneficiaries } from "../../redux/slices/beneficiarySlice";
import { fetchVisits } from "../../redux/slices/visitSlice";

const AddHealthRecord = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =====================================================
  // REDUX STATE
  // =====================================================

  const { beneficiaries = [] } = useSelector(
    (state) => state.beneficiaries
  );

  const { visits = [] } = useSelector(
    (state) => state.visit
  );

  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({
    beneficiaryId: "",
    visitId: "",
    bloodPressure: "",
    weight: "",
    temperature: "",
    hemoglobin: "",
    diagnosis: "",
    prescription: "",
    notes: "",
  });

  // =====================================================
  // FETCH BENEFICIARIES + VISITS
  // =====================================================

  useEffect(() => {
    dispatch(fetchBeneficiaries());
    dispatch(fetchVisits());
  }, [dispatch]);

  // =====================================================
  // FILTER VISITS BY SELECTED BENEFICIARY
  // =====================================================

  const selectedBeneficiaryVisits = visits.filter(
    (visit) =>
      visit.beneficiaryId === formData.beneficiaryId
  );

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // When beneficiary changes,
    // reset the previously selected visit.
    if (name === "beneficiaryId") {
      setFormData((prev) => ({
        ...prev,
        beneficiaryId: value,
        visitId: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT HEALTH RECORD
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!formData.beneficiaryId) {
      alert("Please select a beneficiary.");
      return;
    }

    if (!formData.visitId) {
      alert("Please select a visit.");
      return;
    }

    if (!formData.bloodPressure.trim()) {
      alert("Please enter blood pressure.");
      return;
    }

    if (formData.weight === "") {
      alert("Please enter weight.");
      return;
    }

    if (formData.temperature === "") {
      alert("Please enter temperature.");
      return;
    }

    if (formData.hemoglobin === "") {
      alert("Please enter hemoglobin.");
      return;
    }

    if (!formData.diagnosis.trim()) {
      alert("Please enter diagnosis.");
      return;
    }

    // =================================================
    // CREATE REQUEST OBJECT
    // =================================================

    const healthRecord = {
      beneficiaryId: formData.beneficiaryId,
      visitId: formData.visitId,

      recordedAt: new Date()
        .toISOString()
        .slice(0, 19),

      bloodPressure: formData.bloodPressure.trim(),

      weight: Number(formData.weight),

      temperature: Number(formData.temperature),

      hemoglobin: Number(formData.hemoglobin),

      diagnosis: formData.diagnosis.trim(),

      prescription:
        formData.prescription.trim() || null,

      notes:
        formData.notes.trim() || null,
    };

    console.log(
      "HEALTH RECORD REQUEST:",
      healthRecord
    );

    // =================================================
    // API CALL
    // =================================================

    try {
      const result = await dispatch(
        createHealthRecord(healthRecord)
      ).unwrap();

      console.log(
        "HEALTH RECORD CREATED:",
        result
      );

      navigate("/app/health-records");

    } catch (error) {
      console.error(
        "BACKEND ERROR:",
        error
      );

      // Display backend message if available
      if (typeof error === "string") {
        alert(error);
      } else if (error?.message) {
        alert(error.message);
      } else {
        alert(
          "Failed to create health record."
        );
      }
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="mx-auto max-w-6xl">

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="border-b border-slate-200 px-8 py-6">

          <h3 className="text-2xl font-bold text-slate-900">
            Add Health Record
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Enter beneficiary health details.
          </p>

        </div>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <div className="p-8">

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* ================================================= */}
              {/* BENEFICIARY */}
              {/* ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Beneficiary
                </label>

                <select
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  name="beneficiaryId"
                  value={formData.beneficiaryId}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Beneficiary
                  </option>

                  {beneficiaries.map(
                    (beneficiary) => (
                      <option
                        key={beneficiary.id}
                        value={beneficiary.id}
                      >
                        {beneficiary.name}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* ================================================= */}
              {/* VISIT */}
              {/* ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Visit
                </label>

                <select
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  name="visitId"
                  value={formData.visitId}
                  onChange={handleChange}
                  required
                  disabled={!formData.beneficiaryId}
                >

                  <option value="">
                    {!formData.beneficiaryId
                      ? "Select Beneficiary First"
                      : "Select Visit"}
                  </option>

                  {selectedBeneficiaryVisits.map(
                    (visit) => (
                      <option
                        key={visit.id}
                        value={visit.id}
                      >
                        {visit.visitType}
                        {visit.visitDate
                          ? ` - ${visit.visitDate}`
                          : ""}
                      </option>
                    )
                  )}

                </select>

                {formData.beneficiaryId &&
                  selectedBeneficiaryVisits.length === 0 && (
                    <p className="mt-1 text-xs text-red-500">
                      No visits found for this beneficiary.
                    </p>
                  )}

              </div>

              {/* ================================================= */}
              {/* BLOOD PRESSURE */}
              {/* ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Blood Pressure
                </label>

                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  placeholder="e.g. 120/80"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* ================================================= */}
              {/* WEIGHT */}
              {/* ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Weight
                </label>

                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="300"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 44"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Weight in kg
                </p>

              </div>

              {/* ================================================= */}
              {/* TEMPERATURE */}
              {/* ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Temperature
                </label>

                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="45"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="e.g. 36.5"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Temperature in °C
                </p>

              </div>

              {/* ================================================= */}
              {/* HEMOGLOBIN */}
              {/* ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Hemoglobin
                </label>

                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="30"
                  name="hemoglobin"
                  value={formData.hemoglobin}
                  onChange={handleChange}
                  placeholder="e.g. 12.5"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Hemoglobin in g/dL
                </p>

              </div>

              {/* ================================================= */}
              {/* DIAGNOSIS */}
              {/* ================================================= */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Diagnosis
                </label>

                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  placeholder="Enter diagnosis"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* ================================================= */}
              {/* PRESCRIPTION */}
              {/* ================================================= */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Prescription
                </label>

                <textarea
                  rows="3"
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleChange}
                  placeholder="Enter prescription"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* ================================================= */}
              {/* NOTES */}
              {/* ================================================= */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Notes
                </label>

                <textarea
                  rows="3"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

            {/* ================================================= */}
            {/* BUTTONS */}
            {/* ================================================= */}

            <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">

              <button
                type="button"
                onClick={() =>
                  navigate("/app/health-records")
                }
                className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  !formData.beneficiaryId ||
                  !formData.visitId ||
                  selectedBeneficiaryVisits.length === 0
                }
                className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                Save
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default AddHealthRecord;