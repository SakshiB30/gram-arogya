import { useEffect, useState } from "react";
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
} from "../redux/slices/reportSlice";

export default function ReportsPage() {
  const dispatch = useDispatch();

  const {
    summary,
    beneficiaryReport,
    loading,
    error,
  } = useSelector((state) => state.reports);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchBeneficiaryReport());
  }, [dispatch]);

  const filteredReports = beneficiaryReport.filter((beneficiary) => {
    return (
      beneficiary.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      beneficiary.village
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      beneficiary.category
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <ReportHeader />
        <ExportButton data={filteredReports} />
      </div>

      {/* Statistics */}
      <ReportStats summary={summary} />

      {/* Search */}
      <ReportFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && filteredReports.length === 0 ? (
        <EmptyReports />
      ) : (
        <ReportTable
          reports={filteredReports}
          loading={loading}
        />
      )}
    </div>
  );
}