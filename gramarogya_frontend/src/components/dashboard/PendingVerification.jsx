import React from "react";
import { useNavigate } from "react-router-dom";

const PendingVerification = ({ reports = [], loading = false }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          Pending Verification
        </h2>

        <button
          onClick={() => navigate("/app/verify-reports")}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          View All
        </button>
      </div>

      {/* Loading */}

      {loading && (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      )}

      {/* Empty State */}

      {!loading && reports.length === 0 && (
        <div className="py-10 text-center text-slate-500">
          No reports pending verification.
        </div>
      )}

      {/* Table */}

      {!loading && reports.length > 0 && (
        <div className="mt-5 overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b text-left text-sm text-slate-500">

                <th className="pb-3">Patient</th>

                <th className="pb-3">Report</th>

                <th className="pb-3">Submitted</th>

                <th className="pb-3 text-right">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b last:border-none hover:bg-slate-50"
                >

                  <td className="py-4 font-medium">
                    {report.patientName}
                  </td>

                  <td className="py-4 text-slate-600">
                    {report.reportType}
                  </td>

                  <td className="py-4 text-slate-600">
                    {report.visitDate}
                  </td>

                  <td className="py-4 text-right">

                    <button
                      onClick={() =>
                        navigate(`/app/verify-reports/${report.id}`)
                      }
                      className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      Verify
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default PendingVerification;