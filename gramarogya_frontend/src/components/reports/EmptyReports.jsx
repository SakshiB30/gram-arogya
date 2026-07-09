import React from "react";
import { FileX2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyReports() {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">


      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">

        <FileX2
          size={32}
          className="text-blue-600"
        />

      </div>



      {/* Text */}
      <h2 className="mt-5 text-xl font-bold text-slate-900">

        No Reports Found

      </h2>


      <p className="mt-2 max-w-md text-sm text-slate-500">

        There are no generated reports available.
        Create a new report to view analytics and records.

      </p>



      {/* Button */}
      <button
        onClick={() =>
          navigate("/app/reports/generate")
        }
        className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >

        Generate Report

      </button>


    </div>
  );
}