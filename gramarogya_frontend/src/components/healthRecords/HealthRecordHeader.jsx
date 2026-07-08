import { useNavigate } from "react-router-dom";

const HealthRecordHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Health Records</h1>
        <p className="text-gray-500">
          Manage beneficiary health records
        </p>
      </div>

      <button
        onClick={() => navigate("/app/health-records/add")}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg"
      >
        + Add Health Record
      </button>
    </div>
  );
};

export default HealthRecordHeader;