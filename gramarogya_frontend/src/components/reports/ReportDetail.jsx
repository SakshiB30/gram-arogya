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
      item.beneficiaryName ?? "",
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
      item.beneficiaryName ?? "",
      item.bloodPressure ?? "",
      item.weight ?? "",
      item.temperature ?? "",
      item.hemoglobin ?? "",
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
      "Expiry Date",
      "Status",
    ],
    rows: (item) => [
      item.name ?? item.medicineName ?? "",
      item.category ?? "",
      item.quantity ?? "",
      item.unit ?? "",
      item.expiryDate ?? "",
      item.status ?? "",
    ],
  },

  "low-stock": {
    filename: "low-stock-report.csv",
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

  "out-of-stock": {
    filename: "out-of-stock-report.csv",
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
  console.log("=================================");
  console.log("EXPORT BUTTON");
  console.log("REPORT TYPE:", reportType);
  console.log("DATA:", data);
  console.log("=================================");

  const handleExport = () => {
    console.log("EXPORT CLICKED");
    console.log("FINAL REPORT TYPE:", reportType);

    const selectedConfig = reportConfig[reportType];

    if (!selectedConfig) {
      alert(`Invalid report type: ${reportType}`);
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headerRow = selectedConfig.headers
      .map(escapeCsvValue)
      .join(",");

    const dataRows = data.map((item) =>
      selectedConfig
        .rows(item)
        .map(escapeCsvValue)
        .join(",")
    );

    const csvContent = [headerRow, ...dataRows].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = selectedConfig.filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    console.log(
      `Downloaded ${selectedConfig.filename}`
    );
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      <Download size={18} />
      Export
    </button>
  );
}