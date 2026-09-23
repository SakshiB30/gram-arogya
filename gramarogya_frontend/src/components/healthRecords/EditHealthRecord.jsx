import React, { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchHealthRecordById,
  updateHealthRecord,
} from "../../redux/slices/healthRecordSlice";

import { fetchBeneficiaries } from "../../redux/slices/beneficiarySlice";
import { fetchVisits } from "../../redux/slices/visitSlice";

const EditHealthRecord = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    beneficiaries = [],
  } = useSelector((state) => state.beneficiaries);

  const {
    visits = [],
  } = useSelector((state) => state.visit ?? {});

  const {
    selectedHealthRecord,
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
   * Load the health record, beneficiaries and visits.
   *
   * These Redux actions already support the offline flow:
   *
   * ONLINE  -> backend
   * OFFLINE -> IndexedDB
   */
  useEffect(() => {
    if (!id) return;

    dispatch(fetchHealthRecordById(id));
    dispatch(fetchBeneficiaries());
    dispatch(fetchVisits());
  }, [dispatch, id]);

  /*
   * Populate the form after the health record
   * has been loaded.
   */
  useEffect(() => {
    if (!selectedHealthRecord) return;

    setFormData({
      beneficiaryId:
        selectedHealthRecord.beneficiaryId || "",

      visitId:
        selectedHealthRecord.visitId || "",

      bloodPressure:
        selectedHealthRecord.bloodPressure || "",

      weight:
        selectedHealthRecord.weight ??
        "",

      temperature:
        selectedHealthRecord.temperature ??
        "",

      hemoglobin:
        selectedHealthRecord.hemoglobin ??
        "",

      diagnosis:
        selectedHealthRecord.diagnosis || "",

      prescription:
        selectedHealthRecord.prescription || "",

      notes:
        selectedHealthRecord.notes || "",
    });
  }, [selectedHealthRecord]);

  /*
   * Visits belonging to the selected beneficiary.
   *
   * A visit marked PENDING_DELETE should normally
   * not be selectable.
   *
   * However, if the current health record is already
   * linked to that visit, keep that visit visible so
   * the existing relationship is not lost while editing.
   */
  const selectedBeneficiaryVisits = visits.filter(
    (visit) => {
      if (
        visit.beneficiaryId !==
        formData.beneficiaryId
      ) {
        return false;
      }

      if (
        visit.syncStatus ===
          "PENDING_DELETE" &&
        visit.id !== formData.visitId
      ) {
        return false;
      }

      return true;
    }
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
     * visit may belong to another beneficiary.
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
     * Find the selected visit in local Redux data.
     */
    const selectedVisit = visits.find(
      (visit) =>
        visit.id === formData.visitId
    );

    if (!selectedVisit) {
      return "Selected visit was not found.";
    }

    /*
     * Make sure the visit belongs to the selected
     * beneficiary.
     */
    if (
      selectedVisit.beneficiaryId !==
      formData.beneficiaryId
    ) {
      return "Selected visit does not belong to this beneficiary.";
    }

    /*
     * If this visit was already marked for deletion
     * offline, do not allow changing the health record
     * to use it.
     *
     * The only exception is when it is already the
     * health record's existing visit.
     */
    if (
      selectedVisit.syncStatus ===
        "PENDING_DELETE" &&
      selectedVisit.id !==
        selectedHealthRecord?.visitId
    ) {
      return "This visit has been deleted and cannot be used.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      /*
       * Prepare payload.
       *
       * Numeric values are converted from input
       * strings to numbers.
       */
      const payload = {
        beneficiaryId:
          formData.beneficiaryId,

        visitId:
          formData.visitId,

        bloodPressure:
          formData.bloodPressure.trim() ||
          null,

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
          formData.diagnosis.trim() ||
          null,

        prescription:
          formData.prescription.trim() ||
          null,

        notes:
          formData.notes.trim() ||
          null,
      };

      /*
       * Redux handles online/offline automatically.
       *
       * ONLINE:
       *   PUT /health-records/{id}
       *
       * OFFLINE:
       *   update IndexedDB
       *   +
       *   add UPDATE operation to sync queue
       */
      await dispatch(
        updateHealthRecord({
          id,
          healthRecord: payload,
        })
      ).unwrap();

      navigate("/app/health-records");
    } catch (err) {
      console.error(
        "Failed to update health record:",
        err
      );

      setError(
        err?.message ||
          err ||
          "Failed to update health record."
      );
    }
  };

  /*
   * Loading state while the existing record
   * is being fetched.
   */
  if (
    !selectedHealthRecord &&
    !actionError
  ) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-gray-500">
            Loading health record...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/app/health-records"
            )
          }
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold">
            Edit Health Record
          </h1>

          <p className="text-gray-500">
            Update the health information for
            this beneficiary.
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
        className="space-y-6 rounded-xl border bg-white p-6"
      >
        {/* Beneficiary */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Beneficiary
          </label>

          <select
            name="beneficiaryId"
            value={formData.beneficiaryId}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2"
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

        {/* Visit */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Visit
          </label>

          <select
            name="visitId"
            value={formData.visitId}
            onChange={handleChange}
            disabled={!formData.beneficiaryId}
            className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100"
          >
            <option value="">
              {!formData.beneficiaryId
                ? "Select beneficiary first"
                : selectedBeneficiaryVisits.length ===
                  0
                ? "No visits available"
                : "Select Visit"}
            </option>

            {selectedBeneficiaryVisits.map(
              (visit) => (
                <option
                  key={visit.id}
                  value={visit.id}
                >
                  {visit.visitType ||
                    "Visit"}{" "}
                  -{" "}
                  {visit.scheduledDate ||
                    visit.visitDate ||
                    "No date"}
                  {visit.syncStatus ===
                    "PENDING_DELETE"
                    ? " (Pending Delete)"
                    : ""}
                </option>
              )
            )}
          </select>

          {formData.beneficiaryId &&
            selectedBeneficiaryVisits.length ===
              0 && (
              <p className="mt-2 text-sm text-gray-500">
                No visits are available for
                this beneficiary.
              </p>
            )}
        </div>

        {/* Vital Information */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            Vital Information
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Blood Pressure */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Blood Pressure
              </label>

              <input
                type="text"
                name="bloodPressure"
                value={
                  formData.bloodPressure
                }
                onChange={handleChange}
                placeholder="e.g. 120/80"
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="mb-2 block text-sm font-medium">
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
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Temperature (°C)
              </label>

              <input
                type="number"
                name="temperature"
                value={
                  formData.temperature
                }
                onChange={handleChange}
                min="30"
                max="45"
                step="0.1"
                placeholder="e.g. 36.8"
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            {/* Hemoglobin */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Hemoglobin (g/dL)
              </label>

              <input
                type="number"
                name="hemoglobin"
                value={
                  formData.hemoglobin
                }
                onChange={handleChange}
                min="1"
                max="30"
                step="0.1"
                placeholder="e.g. 13.5"
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Diagnosis
          </label>

          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            rows={3}
            placeholder="Enter diagnosis..."
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Prescription */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Prescription
          </label>

          <textarea
            name="prescription"
            value={
              formData.prescription
            }
            onChange={handleChange}
            rows={3}
            placeholder="Enter prescription..."
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Notes
          </label>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Additional notes..."
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/app/health-records"
              )
            }
            className="rounded-lg border px-5 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={actionLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />

            {actionLoading
              ? "Saving..."
              : "Update Health Record"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHealthRecord;
