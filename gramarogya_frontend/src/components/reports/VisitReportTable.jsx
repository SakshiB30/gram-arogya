import React from "react";

export default function VisitReportTable({
  reports = [],
  loading = false,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-bold text-slate-900">
          Visit Report
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Beneficiary visits and visit activity records.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="min-w-full text-left text-sm">

          <thead>
            <tr className="border-y border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

              <th className="px-6 py-3">
                Beneficiary
              </th>

              <th className="px-6 py-3">
                Visit Date
              </th>

              <th className="px-6 py-3">
                Visit Type
              </th>

              <th className="px-6 py-3">
                Status
              </th>

              <th className="px-6 py-3">
                Notes
              </th>

              <th className="px-6 py-3">
                Next Visit
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
                  Loading visits...
                </td>
              </tr>

            ) : reports.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  className="py-12 text-center text-slate-500"
                >
                  No visits found.
                </td>
              </tr>

            ) : (

              reports.map((visit) => (
                <VisitReportTableRow
                  key={visit.id}
                  visit={visit}
                />
              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}


// =====================================================
// ROW
// =====================================================

function VisitReportTableRow({ visit }) {

  const statusStyles = {
    Completed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Missed: "bg-red-100 text-red-700",
  };

  return (
    <tr className="border-t border-slate-100 transition hover:bg-slate-50">

      {/* Beneficiary */}

      <td className="px-6 py-4">

        <p className="font-semibold text-slate-900">
          {visit.beneficiaryName || "-"}
        </p>

      </td>


      {/* Visit Date */}

      <td className="whitespace-nowrap px-6 py-4 text-slate-700">
        {visit.visitDate || "-"}
      </td>


      {/* Visit Type */}

      <td className="px-6 py-4">

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {visit.visitType || "-"}
        </span>

      </td>


      {/* Status */}

      <td className="px-6 py-4">

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            statusStyles[visit.status] ||
            "bg-slate-100 text-slate-700"
          }`}
        >
          {visit.status || "-"}
        </span>

      </td>


      {/* Notes */}

      <td className="max-w-xs px-6 py-4 text-slate-700">
        {visit.notes || "-"}
      </td>


      {/* Next Visit */}

      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
        {visit.nextVisitDate || "-"}
      </td>

    </tr>
  );
}