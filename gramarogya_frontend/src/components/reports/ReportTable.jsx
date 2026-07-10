import React from "react";
import { Filter } from "lucide-react";

import ReportTableRow from "./ReportTableRow";
import EmptyReports from "./EmptyReports";

export default function ReportTable({
  reports = [],
  loading = false,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">

        <h2 className="text-lg font-bold text-slate-900">
          Beneficiary Report
        </h2>

        <button
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <Filter size={15} />
          Report
        </button>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

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

            {loading ? (

              <tr>
                <td
                  colSpan="6"
                  className="py-12 text-center text-slate-500"
                >
                  Loading reports...
                </td>
              </tr>

            ) : reports.length === 0 ? (

              <tr>
  <td colSpan="6" className="p-0">
    <EmptyReports />
  </td>
</tr>

            ) : (

              reports.map((report) => (
                <ReportTableRow
                  key={report.id}
                  report={report}
                />
              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}