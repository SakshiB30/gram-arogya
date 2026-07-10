import React from "react";
import { Phone } from "lucide-react";

export default function ReportTableRow({ report }) {
  return (
    <tr className="border-t border-slate-100 transition hover:bg-slate-50">

      {/* Name */}
      <td className="px-6 py-4">
        <p className="font-semibold text-slate-900">
          {report.name}
        </p>
      </td>

      {/* Age */}
      <td className="px-6 py-4 text-slate-700">
        {report.age}
      </td>

      {/* Gender */}
      <td className="px-6 py-4 text-slate-700">
        {report.gender}
      </td>

      {/* Village */}
      <td className="px-6 py-4 text-slate-700">
        {report.village}
      </td>

      {/* Category */}
      <td className="px-6 py-4">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {report.category}
        </span>
      </td>

      {/* Mobile */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-slate-700">
          <Phone
            size={16}
            className="text-slate-400"
          />
          {report.mobileNumber || "-"}
        </div>
      </td>

    </tr>
  );
}