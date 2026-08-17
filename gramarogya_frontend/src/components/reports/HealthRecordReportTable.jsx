import React from "react";

export default function HealthRecordReportTable({
  reports = [],
  loading = false,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-bold text-slate-900">
          Health Record Report
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Health assessments and medical information of beneficiaries.
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
                Blood Pressure
              </th>

              <th className="px-6 py-3">
                Weight
              </th>

              <th className="px-6 py-3">
                Temperature
              </th>

              <th className="px-6 py-3">
                Hemoglobin
              </th>

              <th className="px-6 py-3">
                Diagnosis
              </th>

              <th className="px-6 py-3">
                Prescription
              </th>

              <th className="px-6 py-3">
                Notes
              </th>

              <th className="px-6 py-3">
                Created At
              </th>

            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="9"
                  className="py-12 text-center text-slate-500"
                >
                  Loading health records...
                </td>
              </tr>

            ) : reports.length === 0 ? (

              <tr>
                <td
                  colSpan="9"
                  className="py-12 text-center text-slate-500"
                >
                  No health records found.
                </td>
              </tr>

            ) : (

              reports.map((record) => (
                <HealthRecordReportTableRow
                  key={record.id}
                  record={record}
                />
              ))

            )}

          </tbody>

        </table>
      </div>
    </div>
  );
}


function HealthRecordReportTableRow({ record }) {

  return (
    <tr className="border-t border-slate-100 transition hover:bg-slate-50">

      {/* Beneficiary */}
      <td className="px-6 py-4">
        <p className="font-semibold text-slate-900">
          {record.beneficiaryName || "-"}
        </p>
      </td>

      {/* Blood Pressure */}
      <td className="px-6 py-4 text-slate-700">
        {record.bloodPressure || "-"}
      </td>

      {/* Weight */}
      <td className="px-6 py-4 text-slate-700">
        {record.weight != null
          ? `${record.weight} kg`
          : "-"}
      </td>

      {/* Temperature */}
      <td className="px-6 py-4 text-slate-700">
        {record.temperature != null
          ? `${record.temperature} °C`
          : "-"}
      </td>

      {/* Hemoglobin */}
      <td className="px-6 py-4 text-slate-700">
        {record.hemoglobin != null
          ? `${record.hemoglobin} g/dL`
          : "-"}
      </td>

      {/* Diagnosis */}
      <td className="px-6 py-4">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {record.diagnosis || "-"}
        </span>
      </td>

      {/* Prescription */}
      <td className="max-w-xs px-6 py-4 text-slate-700">
        {record.prescription || "-"}
      </td>

      {/* Notes */}
      <td className="max-w-xs px-6 py-4 text-slate-700">
        {record.notes || "-"}
      </td>

      {/* Created At */}
      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
        {record.createdAt || "-"}
      </td>

    </tr>
  );
}