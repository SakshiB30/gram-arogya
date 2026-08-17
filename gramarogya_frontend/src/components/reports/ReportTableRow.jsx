import React from "react";
import { Phone } from "lucide-react";

export default function ReportTableRow({
  report,
  reportType,
}) {


  // =====================================================
  // BENEFICIARY
  // =====================================================

  if (reportType === "beneficiary") {

    return (
      <tr className="border-t border-slate-100 transition hover:bg-slate-50">

        <td className="px-6 py-4 font-semibold text-slate-900">
          {report.name || "-"}
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
    );
  }


  // =====================================================
  // VISIT
  // =====================================================

  if (reportType === "visit") {

    return (
      <tr className="border-t border-slate-100 transition hover:bg-slate-50">

        <td className="px-6 py-4 font-semibold text-slate-900">
          {report.beneficiaryName || "-"}
        </td>

        <td className="px-6 py-4">
          {report.visitType || "-"}
        </td>

        <td className="px-6 py-4">
          {report.visitDate || "-"}
        </td>

        <td className="px-6 py-4">

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            {report.status || "-"}
          </span>

        </td>

        <td className="px-6 py-4">
          {report.ashaWorker || "-"}
        </td>

      </tr>
    );
  }


  // =====================================================
  // HEALTH RECORD
  // =====================================================

  if (reportType === "health") {

    return (
      <tr className="border-t border-slate-100 transition hover:bg-slate-50">

        <td className="px-6 py-4 font-semibold">
          {report.beneficiaryName || "-"}
        </td>

        <td className="px-6 py-4">
          {report.bloodPressure || "-"}
        </td>

        <td className="px-6 py-4">
          {report.weight ?? "-"}
        </td>

        <td className="px-6 py-4">
          {report.temperature ?? "-"}
        </td>

        <td className="px-6 py-4">
          {report.diagnosis || "-"}
        </td>

        <td className="px-6 py-4">
          {report.createdAt || "-"}
        </td>

      </tr>
    );
  }


  // =====================================================
  // INVENTORY
  // =====================================================

  if (reportType === "inventory") {

    return (
      <tr className="border-t border-slate-100 transition hover:bg-slate-50">

        <td className="px-6 py-4 font-semibold">
          {report.name || "-"}
        </td>

        <td className="px-6 py-4">
          {report.type || "-"}
        </td>

        <td className="px-6 py-4">
          {report.batch || "-"}
        </td>

        <td className="px-6 py-4">
          {report.stock ?? 0}
        </td>

        <td className="px-6 py-4">

          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {formatStatus(report.status)}
          </span>

        </td>

        <td className="px-6 py-4">
          {report.expiryDate || "-"}
        </td>

      </tr>
    );
  }


  return null;
}


function formatStatus(status) {

  if (!status) {
    return "-";
  }

  /*
   * Handles enum values such as:
   * LOW_STOCK
   * OUT_OF_STOCK
   */

  return status
    .toString()
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}