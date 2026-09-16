import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  createHealthRecord,
  fetchHealthRecords,
} from "../../redux/slices/healthRecordSlice";

import { fetchBeneficiaries } from "../../redux/slices/beneficiarySlice";
import { fetchVisits } from "../../redux/slices/visitSlice";

const AddHealthRecord = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    beneficiaries = [],
  } = useSelector((state) => state.beneficiaries);

  const {
    visits = [],
  } = useSelector((state) => state.visit);

  const {
    healthRecords = [],
    actionLoading = false,
    actionError = null,
  } = useSelector((state) => state.healthRecords);

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

  const [error, setError] = useState("");

  /*
   * Load required data when page opens.
   *
   * If online:
   *   Redux fetches data from backend and also stores
   *   the data locally through the offline services.
   *
   * If offline:
   *   the same Redux actions return data from IndexedDB.
   */
  useEffect(() => {
    dispatch(fetchBeneficiaries());
    dispatch(fetchVisits());
    dispatch(fetchHealthRecords());
  }, [dispatch]);

  /*
   * IMPORTANT OFFLINE RULE:
   *
   * A visit marked PENDING_DELETE has already been deleted
   * locally and should NOT be available for creating a
   * health record.
   *
   * We also filter visits by the selected beneficiary.
   */
  const allSelectedBeneficiaryVisits = visits.filter(
    (visit) =>
      visit.beneficiaryId === formData.beneficiaryId &&
      visit.syncStatus !== "PENDING_DELETE"
  );

  /*
   * A visit can have only one health record.
   *
   * Therefore:
   * 1. Ignore visits marked PENDING_DELETE.
   * 2. Ignore visits that already have a health record.
   */
  const selectedBeneficiaryVisits =
    allSelectedBeneficiaryVisits.filter(
      (visit) =>
        visit.syncStatus !== "PENDING_DELETE" &&
        !healthRecords.some(
          (record) =>
            record.visitId === visit.id &&
            record.syncStatus !== "PENDING_DELETE"
        )
    );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");

    /*
     * If beneficiary changes, the previously selected
     * visit may no longer belong to that beneficiary.
     */
    if (name === "beneficiaryId") {
      setFormData((prev) => ({
        ...prev,
        beneficiaryId: value,
        visitId: "",
      }));
    }
  };

  const validateForm = () => {
    if (!formData.beneficiaryId) {
      return "Please select a beneficiary.";
    }

    if (!formData.visitId) {
      return "Please select a visit.";
    }

    /*
     * Double protection:
     *
     * Even if the UI somehow contains an old visit,
     * do not allow a health record to be created for
     * a visit marked for deletion.
     */
    const selectedVisit = visits.find(
      (visit) => visit.id === formData.visitId
    );

    if (!selectedVisit) {
      return "Selected visit was not found.";
    }

    if (selectedVisit.syncStatus === "PENDING_DELETE") {
      return "This visit has been deleted and cannot have a health record.";
    }

    /*
     * Prevent duplicate health record creation.
     */
    const existingHealthRecord = healthRecords.some(
      (record) =>
        record.visitId === formData.visitId &&
        record.syncStatus !== "PENDING_DELETE"
    );

    if (existingHealthRecord) {
      return "A health record already exists for this visit.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      /*
       * Convert numeric fields from strings to numbers.
       *
       * Empty optional fields remain undefined.
       */
      
const payload = {
  beneficiaryId: formData.beneficiaryId,
  visitId: formData.visitId,

  // Backend requires recordedAt.
  // Remove the trailing "Z" because the backend uses LocalDateTime.
  recordedAt: new Date()
    .toISOString()
    .slice(0, 19),

  bloodPressure:
    formData.bloodPressure.trim() || null,

  weight:
    formData.weight === ""
      ? null
      : Number(formData.weight),

  temperature:
    formData.temperature === ""
      ? null
      : Number(formData.temperature),

  hemoglobin:
    formData.hemoglobin === ""
      ? null
      : Number(formData.hemoglobin),

  diagnosis:
    formData.diagnosis.trim() || null,

  prescription:
    formData.prescription.trim() || null,

  notes:
    formData.notes.trim() || null,
};


      /*
       * Redux decides automatically:
       *
       * ONLINE  -> POST to Spring Boot
       *
       * OFFLINE -> save to IndexedDB
       *            +
       *            add CREATE operation to sync queue
       */
      await dispatch(
        createHealthRecord(payload)
      ).unwrap();

      navigate("/app/health-records");
    } catch (err) {
      console.error(
        "Failed to create health record:",
        err
      );

      setError(
        err?.message ||
          err ||
          "Failed to create health record."
      );
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() =>
            navigate("/app/health-records")
          }
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold">
            Add Health Record
          </h1>

          <p className="text-gray-500">
            Record health information for a completed
            beneficiary visit.
          </p>
        </div>
      </div>

      {/* Error */}
      {(error || actionError) && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error || actionError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border p-6 space-y-6"
      >
        {/* Beneficiary */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Beneficiary
          </label>

          <select
            name="beneficiaryId"
            value={formData.beneficiaryId}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">
              Select Beneficiary
            </option>

            {beneficiaries.map((beneficiary) => (
              <option
                key={beneficiary.id}
                value={beneficiary.id}
              >
                {beneficiary.name}
              </option>
            ))}
          </select>
        </div>

        {/* Visit */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Visit
          </label>

          <select
            name="visitId"
            value={formData.visitId}
            onChange={handleChange}
            disabled={!formData.beneficiaryId}
            className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
          >
            <option value="">
              {!formData.beneficiaryId
                ? "Select beneficiary first"
                : selectedBeneficiaryVisits.length === 0
                ? "No eligible visits available"
                : "Select Visit"}
            </option>

            {selectedBeneficiaryVisits.map(
              (visit) => (
                <option
                  key={visit.id}
                  value={visit.id}
                >
                  {visit.visitType || "Visit"}{" "}
                  -{" "}
                  {visit.scheduledDate ||
                    visit.visitDate ||
                    "No date"}
                </option>
              )
            )}
          </select>

          {formData.beneficiaryId &&
            selectedBeneficiaryVisits.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                No eligible visits are available for
                this beneficiary. A visit may already
                have a health record or may be pending
                deletion.
              </p>
            )}
        </div>

        {/* Vital Information */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Vital Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Blood Pressure */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Blood Pressure
              </label>

              <input
                type="text"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleChange}
                placeholder="e.g. 120/80"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Weight (kg)
              </label>

              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="1"
                max="300"
                step="0.1"
                placeholder="e.g. 65"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Temperature (°C)
              </label>

              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                min="30"
                max="45"
                step="0.1"
                placeholder="e.g. 36.8"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Hemoglobin */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Hemoglobin (g/dL)
              </label>

              <input
                type="number"
                name="hemoglobin"
                value={formData.hemoglobin}
                onChange={handleChange}
                min="1"
                max="30"
                step="0.1"
                placeholder="e.g. 13.5"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Diagnosis
          </label>

          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            rows={3}
            placeholder="Enter diagnosis..."
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Prescription */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Prescription
          </label>

          <textarea
            name="prescription"
            value={formData.prescription}
            onChange={handleChange}
            rows={3}
            placeholder="Enter prescription..."
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Notes
          </label>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Additional notes..."
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() =>
              navigate("/app/health-records")
            }
            className="px-5 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={18} />

            {actionLoading
              ? "Saving..."
              : "Save Health Record"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHealthRecord;
