import { Plus } from "lucide-react";

const DashboardHeader = ({
  doctorName,
  onNewReport,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-blue-50 p-6 md:flex-row md:items-center md:justify-between">

      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {doctorName || "ASHA Worker"}!
        </h1>

        <p className="mt-2 text-slate-600">
          Here's an overview of your Primary Health Center for today.
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;