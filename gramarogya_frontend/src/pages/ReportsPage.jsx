import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReportHeader from "../components/reports/ReportHeader";
import ReportStats from "../components/reports/ReportStats";
import ReportFilter from "../components/reports/ReportFilter";
import ReportTable from "../components/reports/ReportTable";
import ExportButton from "../components/reports/ExportButton";
import EmptyReports from "../components/reports/EmptyReports";

import {
  fetchSummary,
  fetchBeneficiaryReport,
  fetchVisitReport,
  fetchInventoryReport,
  fetchHealthRecordReport,
  fetchLowStockReport,
  fetchOutOfStockReport,
} from "../redux/slices/reportSlice";

export default function ReportsPage() {
  const dispatch = useDispatch();

  const {
    summary,
    beneficiaryReport,
    visitReport,
    inventoryReport,
    healthRecordReport,
    lowStockReport,
    outOfStockReport,
    loading,
    error,
  } = useSelector((state) => state.reports);

  // =====================================================
  // STATE
  // =====================================================

  const [reportType, setReportType] = useState("beneficiary");
  const [searchTerm, setSearchTerm] = useState("");

  // =====================================================
  // FETCH SUMMARY
  // =====================================================

  useEffect(() => {
    dispatch(fetchSummary());
  }, [dispatch]);

  // =====================================================
  // FETCH SELECTED REPORT
  // =====================================================

  useEffect(() => {
    switch (reportType) {
      case "beneficiary":
        dispatch(fetchBeneficiaryReport());
        break;

      case "visit":
        dispatch(fetchVisitReport());
        break;

      case "health":
        dispatch(fetchHealthRecordReport());
        break;

      case "inventory":
        dispatch(fetchInventoryReport());
        break;

      case "low-stock":
        dispatch(fetchLowStockReport());
        break;

      case "out-of-stock":
        dispatch(fetchOutOfStockReport());
        break;

      default:
        dispatch(fetchBeneficiaryReport());
    }
  }, [dispatch, reportType]);

  // =====================================================
  // GET CURRENT REPORT DATA
  // =====================================================

  const currentReports = useMemo(() => {
    switch (reportType) {
      case "beneficiary":
        return beneficiaryReport;

      case "visit":
        return visitReport;

      case "health":
        return healthRecordReport;

      case "inventory":
        return inventoryReport;

      case "low-stock":
        return lowStockReport;

      case "out-of-stock":
        return outOfStockReport;

      default:
        return [];
    }
  }, [
    reportType,
    beneficiaryReport,
    visitReport,
    healthRecordReport,
    inventoryReport,
    lowStockReport,
    outOfStockReport,
  ]);

  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  const filteredReports = useMemo(() => {
    if (!searchTerm.trim()) {
      return currentReports;
    }

    const search = searchTerm.toLowerCase();

    return currentReports.filter((item) => {
      return Object.values(item || {}).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [currentReports, searchTerm]);

  // =====================================================
  // REPORT TITLE
  // =====================================================

  const reportTitle = {
    beneficiary: "Beneficiary Report",
    visit: "Visit Report",
    health: "Health Record Report",
    inventory: "Inventory Report",
    "low-stock": "Low Stock Report",
    "out-of-stock": "Out of Stock Report",
  };

  // =====================================================
  // EXPORT DATA
  // =====================================================

  const exportData = filteredReports;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <ReportHeader />

        <ExportButton
          data={exportData}
        />

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <ReportStats
        summary={summary}
      />


      {/* =================================================
          REPORT TYPE FILTER
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Report Type */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Report Type
            </label>

            <select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setSearchTerm("");
              }}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              <option value="beneficiary">
                Beneficiary Report
              </option>

              <option value="visit">
                Visit Report
              </option>

              <option value="health">
                Health Record Report
              </option>

              <option value="inventory">
                Inventory Report
              </option>

              <option value="low-stock">
                Low Stock Report
              </option>

              <option value="out-of-stock">
                Out of Stock Report
              </option>

            </select>

          </div>

        </div>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <ReportFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          {typeof error === "string"
            ? error
            : "Failed to load report."}
        </div>

      )}


      {/* =================================================
          REPORT TABLE
      ================================================= */}

      {!loading && filteredReports.length === 0 ? (

        <EmptyReports
          reportType={reportType}
        />

      ) : (

        <ReportTable
          reports={filteredReports}
          loading={loading}
          reportType={reportType}
          title={reportTitle[reportType]}
        />

      )}

    </div>
  );
}