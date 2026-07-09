import React from "react";
import { Download } from "lucide-react";

export default function ExportButton({ reports = [] }) {

  const handleExport = () => {
    if (!reports.length) {
      alert("No reports available to export");
      return;
    }

    const headers = [
      "Report ID",
      "Beneficiary",
      "Visit Type",
      "Diagnosis",
      "Prescription",
      "Created Date",
    ];

    const rows = reports.map((report) => [
      report.id,
      report.beneficiaryName || "-",
      report.visitType || "-",
      report.diagnosis || "-",
      report.prescription || "-",
      report.createdAt || "-",
    ]);


    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => `"${value}"`)
          .join(",")
      )
      .join("\n");


    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );


    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "health-reports.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };


  return (
    <button
      onClick={handleExport}
      className="
        flex items-center gap-2
        rounded-xl
        bg-green-600
        px-5
        py-3
        text-sm
        font-semibold
        text-white
        shadow-sm
        hover:bg-green-700
      "
    >
      <Download size={18} />

      Export Report
    </button>
  );
}