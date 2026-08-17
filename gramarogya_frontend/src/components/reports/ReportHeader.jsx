import { FileBarChart2 } from "lucide-react";

export default function ReportHeader() {

  return (
    <div className="flex items-center gap-4">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">

        <FileBarChart2
          size={28}
          className="text-blue-600"
        />

      </div>


      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          Reports
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View healthcare reports, statistics, and export data.
        </p>

      </div>

    </div>
  );
}