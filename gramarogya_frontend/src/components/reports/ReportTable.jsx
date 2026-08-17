import React from "react";

import BeneficiaryReportTable from "./BeneficiaryReportTable";
import VisitReportTable from "./VisitReportTable";
import HealthRecordReportTable from "./HealthRecordReportTable";
import InventoryReportTable from "./InventoryReportTable";

import EmptyReports from "./EmptyReports";

export default function ReportTable({
  reports = [],
  loading = false,
  reportType = "beneficiary",
  title = "Report",
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between px-6 py-4">

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {reports.length} record
            {reports.length !== 1 ? "s" : ""}
          </p>
        </div>

      </div>


      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="py-16 text-center text-slate-500">
          Loading reports...
        </div>

      ) : reports.length === 0 ? (

        <EmptyReports reportType={reportType} />

      ) : (

        <div className="overflow-x-auto">

          {reportType === "beneficiary" && (
            <BeneficiaryReportTable
              reports={reports}
            />
          )}

          {reportType === "visit" && (
            <VisitReportTable
              reports={reports}
            />
          )}

          {reportType === "health" && (
            <HealthRecordReportTable
              reports={reports}
            />
          )}

          {(reportType === "inventory" ||
            reportType === "low-stock" ||
            reportType === "out-of-stock") && (
            <InventoryReportTable
              reports={reports}
            />
          )}

        </div>

      )}

    </div>
  );
}