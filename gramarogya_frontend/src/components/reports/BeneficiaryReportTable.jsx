import React from "react";
import { Phone } from "lucide-react";

export default function BeneficiaryReportTable({
  reports = [],
}) {
  return (
    <table className="min-w-full text-left text-sm">

      <thead>
        <tr className="border-y border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

          <th className="px-6 py-3">
            Name
          </th>

          <th className="px-6 py-3">
            Age
          </th>

          <th className="px-6 py-3">
            Gender
          </th>

          <th className="px-6 py-3">
            Village
          </th>

          <th className="px-6 py-3">
            Category
          </th>

          <th className="px-6 py-3">
            Mobile
          </th>

        </tr>
      </thead>

      <tbody>

        {reports.map((report) => (

          <tr
            key={report.id}
            className="border-t border-slate-100 transition hover:bg-slate-50"
          >

            <td className="px-6 py-4">
              <p className="font-semibold text-slate-900">
                {report.name || "-"}
              </p>
            </td>

            <td className="px-6 py-4 text-slate-700">
              {report.age ?? "-"}
            </td>

            <td className="px-6 py-4 text-slate-700">
              {report.gender || "-"}
            </td>

            <td className="px-6 py-4 text-slate-700">
              {report.village || "-"}
            </td>

            <td className="px-6 py-4">

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {report.category || "-"}
              </span>

            </td>

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

        ))}

      </tbody>

    </table>
  );
}