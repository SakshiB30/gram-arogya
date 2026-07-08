import { Plus } from "lucide-react";

const DashboardHeader = ({
  doctorName = "Dr. Rajesh Kumar",
  onNewReport,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-blue-50 p-6 md:flex-row md:items-center md:justify-between">

      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {doctorName}
        </h1>

        <p className="mt-2 text-slate-600">
          Here's an overview of your Primary Health Center for today.
        </p>
      </div>

      {/* Right */}
      <button
        onClick={onNewReport}
        className="
          flex items-center gap-2
          rounded-lg
          bg-blue-600
          px-5 py-3
          text-white
          font-medium
          shadow-sm
          transition
          hover:bg-blue-700
        "
      >
        <Plus size={18} />
        New Report
      </button>

    </div>
  );
};

export default DashboardHeader;