import React from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus2 } from "lucide-react";

export default function ReportHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Reports
        </h1>

        <p className="mt-1 text-slate-500">
          Generate, view, download and manage healthcare reports.
        </p>
      </div>

      {/* Right */}
      <button
        onClick={() => navigate("/app/reports/generate")}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
      >
        <FilePlus2 size={18} />
        Generate Report
      </button>
    </div>
  );
}