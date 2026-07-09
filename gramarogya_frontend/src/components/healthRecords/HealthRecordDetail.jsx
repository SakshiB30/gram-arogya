import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h4 className="text-lg font-semibold text-slate-700">
          Loading...
        </h4>
      </div>
    );
  }

  if (!selectedHealthRecord) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h4 className="text-xl font-semibold text-slate-800">
          Health Record Not Found
        </h4>

        <button
          onClick={() => navigate("/app/health-records")}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Health Record Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View complete beneficiary health information.
            </p>
          </div>

          <button
            onClick={() => navigate("/app/health-records")}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            Back
          </button>

        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2">

          <div>
            <label className="text-sm font-medium text-slate-500">
              Beneficiary
            </label>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              {selectedHealthRecord.beneficiaryName}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-500">
              Visit
            </label>

            <p className="mt-2 text-slate-900">
              {selectedHealthRecord.visitType}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-500">
              Blood Pressure
            </label>

            <p className="mt-2 text-slate-900">
              {selectedHealthRecord.bloodPressure}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-500">
              Weight
            </label>

            <p className="mt-2 text-slate-900">
              {selectedHealthRecord.weight}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-500">
              Temperature
            </label>

            <p className="mt-2 text-slate-900">
              {selectedHealthRecord.temperature}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-500">
              Hemoglobin
            </label>

            <p className="mt-2 text-slate-900">
              {selectedHealthRecord.hemoglobin}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-500">
              Diagnosis
            </label>

            <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900">
              {selectedHealthRecord.diagnosis}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-500">
              Prescription
            </label>

            <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900">
              {selectedHealthRecord.prescription}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-500">
              Notes
            </label>

            <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900">
              {selectedHealthRecord.notes}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-500">
              Created At
            </label>

            <p className="mt-2 text-slate-900">
              {selectedHealthRecord.createdAt}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-500">
              Updated At
            </label>

            <p className="mt-2 text-slate-900">
              {selectedHealthRecord.updatedAt}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default HealthRecordDetail;