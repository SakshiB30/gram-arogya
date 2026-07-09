import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createHealthRecord } from "../../redux/slices/healthRecordSlice";
import { fetchBeneficiaries } from "../../redux/slices/beneficiarySlice";
import { fetchVisits } from "../../redux/slices/visitSlice";

const AddHealthRecord = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { beneficiaries } = useSelector(
    (state) => state.beneficiaries
  );

  const { visits } = useSelector(
    (state) => state.visit
  );

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

  useEffect(() => {
    dispatch(fetchBeneficiaries());
    dispatch(fetchVisits());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(createHealthRecord(formData));

    navigate("/app/health-records");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        
        {/* Header */}
        <div className="border-b border-slate-200 px-8 py-6">
          <h3 className="text-2xl font-bold text-slate-900">
            Add Health Record
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Enter beneficiary health details.
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Beneficiary */}
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
                  <option value="">Select Beneficiary</option>

                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visit */}
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
                >
                  <option value="">Select Visit</option>

                  {visits.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.visitType}
                    </option>
                  ))}
                </select>
              </div>

              {/* Blood Pressure */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Blood Pressure
                </label>

                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                />
              </div>

              {/* Weight */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Weight
                </label>

                <input
                  type="number"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Temperature
                </label>

                <input
                  type="number"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                />
              </div>

              {/* Hemoglobin */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Hemoglobin
                </label>

                <input
                  type="number"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  name="hemoglobin"
                  value={formData.hemoglobin}
                  onChange={handleChange}
                />
              </div>

              {/* Diagnosis */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Diagnosis
                </label>

                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                />
              </div>

              {/* Prescription */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Prescription
                </label>

                <textarea
                  rows="3"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleChange}
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Notes
                </label>

                <textarea
                  rows="3"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={() => navigate("/app/health-records")}
                className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
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