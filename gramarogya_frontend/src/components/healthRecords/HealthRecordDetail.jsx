import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { fetchHealthRecordById } from "../../redux/slices/healthRecordSlice";

const HealthRecordDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedHealthRecord, loading } = useSelector(
    (state) => state.healthRecords
  );

  useEffect(() => {
    dispatch(fetchHealthRecordById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading...</h4>
      </div>
    );
  }

  if (!selectedHealthRecord) {
    return (
      <div className="text-center mt-5">
        <h4>Health Record Not Found</h4>

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/app/health-records")}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">

      <div className="card shadow">

        <div className="card-header d-flex justify-content-between align-items-center">

          <h3>Health Record Details</h3>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/app/health-records")}
          >
            Back
          </button>

        </div>

        <div className="card-body">

          <div className="row">

            <div className="col-md-6 mb-3">
              <strong>Beneficiary</strong>
              <p>{selectedHealthRecord.beneficiaryName}</p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Visit</strong>
              <p>{selectedHealthRecord.visitType}</p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Blood Pressure</strong>
              <p>{selectedHealthRecord.bloodPressure}</p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Weight</strong>
              <p>{selectedHealthRecord.weight}</p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Temperature</strong>
              <p>{selectedHealthRecord.temperature}</p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Hemoglobin</strong>
              <p>{selectedHealthRecord.hemoglobin}</p>
            </div>

            <div className="col-md-12 mb-3">
              <strong>Diagnosis</strong>
              <p>{selectedHealthRecord.diagnosis}</p>
            </div>

            <div className="col-md-12 mb-3">
              <strong>Prescription</strong>
              <p>{selectedHealthRecord.prescription}</p>
            </div>

            <div className="col-md-12 mb-3">
              <strong>Notes</strong>
              <p>{selectedHealthRecord.notes}</p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Created At</strong>
              <p>{selectedHealthRecord.createdAt}</p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Updated At</strong>
              <p>{selectedHealthRecord.updatedAt}</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default HealthRecordDetail;