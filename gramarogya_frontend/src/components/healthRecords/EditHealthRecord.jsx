import { useEffect, useState } from "react";
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

  const { selectedHealthRecord } = useSelector(
    (state) => state.healthRecords
  );

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
    dispatch(fetchHealthRecordById(id));
    dispatch(fetchBeneficiaries());
    dispatch(fetchVisits());
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedHealthRecord) {
      setFormData({
        beneficiaryId: selectedHealthRecord.beneficiaryId || "",
        visitId: selectedHealthRecord.visitId || "",
        bloodPressure: selectedHealthRecord.bloodPressure || "",
        weight: selectedHealthRecord.weight || "",
        temperature: selectedHealthRecord.temperature || "",
        hemoglobin: selectedHealthRecord.hemoglobin || "",
        diagnosis: selectedHealthRecord.diagnosis || "",
        prescription: selectedHealthRecord.prescription || "",
        notes: selectedHealthRecord.notes || "",
      });
    }
  }, [selectedHealthRecord]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      updateHealthRecord({
        id,
        healthRecord: formData,
      })
    );

    navigate("/app/health-records");
  };

  return (
    <div className="container-fluid">
      <div className="card shadow">

        <div className="card-header">
          <h3>Edit Health Record</h3>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Beneficiary</label>

                <select
                  className="form-control"
                  name="beneficiaryId"
                  value={formData.beneficiaryId}
                  onChange={handleChange}
                >
                  <option value="">Select Beneficiary</option>

                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Visit</label>

                <select
                  className="form-control"
                  name="visitId"
                  value={formData.visitId}
                  onChange={handleChange}
                >
                  <option value="">Select Visit</option>

                  {visits.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.visitType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Blood Pressure</label>

                <input
                  type="text"
                  className="form-control"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Weight</label>

                <input
                  type="number"
                  className="form-control"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Temperature</label>

                <input
                  type="number"
                  className="form-control"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Hemoglobin</label>

                <input
                  type="number"
                  className="form-control"
                  name="hemoglobin"
                  value={formData.hemoglobin}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label>Diagnosis</label>

                <input
                  type="text"
                  className="form-control"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label>Prescription</label>

                <textarea
                  rows="3"
                  className="form-control"
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label>Notes</label>

                <textarea
                  rows="3"
                  className="form-control"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

            </div>

            <button className="btn btn-primary me-2">
              Update
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/app/health-records")}
            >
              Cancel
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default EditHealthRecord;