import { Download } from "lucide-react";

const reportConfig = {
  beneficiary: {
    filename: "beneficiary-report.csv",
    headers: [
      "Name",
      "Age",
      "Gender",
      "Village",
      "Category",
      "Mobile Number",
    ],
    rows: (item) => [
      item.name ?? "",
      item.age ?? "",
      item.gender ?? "",
      item.village ?? "",
      item.category ?? "",
      item.mobileNumber ?? "",
    ],
  },

  visit: {
    filename: "visit-report.csv",
    headers: [
      "Beneficiary",
      "Visit Date",
      "Visit Type",
      "Status",
      "Notes",
      "Next Visit Date",
    ],
    rows: (item) => [
      item.beneficiaryName ?? item.name ?? "",
      item.visitDate ?? "",
      item.visitType ?? "",
      item.status ?? "",
      item.notes ?? "",
      item.nextVisitDate ?? "",
    ],
  },

  health: {
    filename: "health-record-report.csv",
    headers: [
      "Beneficiary",
      "Blood Pressure",
      "Weight",
      "Temperature",
      "Hemoglobin",
      "Diagnosis",
      "Prescription",
      "Notes",
      "Created At",
    ],
    rows: (item) => [
      item.beneficiaryName ?? item.name ?? "",
      item.bloodPressure ?? item.vitals?.bloodPressure ?? "",
      item.weight ?? item.vitals?.weight ?? "",
      item.temperature ?? item.vitals?.temperature ?? "",
      item.hemoglobin ?? item.vitals?.hemoglobin ?? "",
      item.diagnosis ?? "",
      item.prescription ?? "",
      item.notes ?? "",
      item.createdAt ?? "",
    ],
  },

  inventory: {
    filename: "inventory-report.csv",
    headers: [
      "Medicine Name",
      "Category",
      "Quantity",
      "Unit",
      "Status",
    ],
    rows: (item) => [
      item.name ?? item.medicineName ?? "",
      item.category ?? "",
      item.quantity ?? "",
      item.unit ?? "",
      item.status ?? "",
    ],
  },

  "low-stock": {
    filename: "low-stock-report.csv",
    headers: [
      "Medicine Name",
      "Quantity",
      "Status",
    ],
    rows: (item) => [
      item.name ?? item.medicineName ?? "",
      item.quantity ?? "",
      item.status ?? "",
    ],
  },

  "out-of-stock": {
    filename: "out-of-stock-report.csv",
    headers: [
      "Medicine Name",
      "Quantity",
      "Status",
    ],
    rows: (item) => [
      item.name ?? item.medicineName ?? "",
      item.quantity ?? "",
      item.status ?? "",
    ],
  },
};

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

export default function ExportButton({
  data = [],
  reportType,
}) {
  const handleExport = () => {
    console.log("================================");
    console.log("EXPORT REPORT TYPE:", reportType);
    console.log("EXPORT DATA:", data);
    console.log("================================");

    if (!reportType || !reportConfig[reportType]) {
      alert("Please select a valid report type.");
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      alert(`No ${reportType} report data available to export.`);
      return;
    }

    const config = reportConfig[reportType];

    const csvRows = [];

    csvRows.push(
      config.headers
        .map(escapeCsvValue)
        .join(",")
    );

    data.forEach((item) => {
      csvRows.push(
        config
          .rows(item)
          .map(escapeCsvValue)
          .join(",")
      );
    });

    const csvContent = "\uFEFF" + csvRows.join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = config.filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      <Download size={17} />
      Download Report
    </button>
  );
}