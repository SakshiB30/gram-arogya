import React from "react";
import { FileSearch } from "lucide-react";

export default function EmptyReports() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">

      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <FileSearch
          size={40}
          className="text-slate-500"
        />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        No Reports Found
      </h2>

      <p className="mt-2 max-w-md text-slate-500">
        There are currently no beneficiary reports available.
        Once beneficiaries are added, they will appear here.
      </p>

    </div>
  );
}