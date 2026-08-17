import React from "react";
import { FileSearch } from "lucide-react";

export default function EmptyReports({
  reportType = "beneficiary",
}) {

  const names = {

    beneficiary: "beneficiary",

    visit: "visit",

    health: "health record",

    inventory: "inventory",

  };


  const name =
    names[reportType] || "report";


  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">

      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">

        <FileSearch
          size={40}
          className="text-slate-500"
        />

      </div>


      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        No {name} reports found
      </h2>


      <p className="mt-2 max-w-md text-slate-500">
        There is currently no {name} report data available.
        Once data is added to the system, it will appear here.
      </p>

    </div>
  );
}