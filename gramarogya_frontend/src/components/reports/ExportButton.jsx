import { Download } from "lucide-react";

export default function ExportButton({
  data = [],
  reportType = "beneficiary",
}) {

  const exportCSV = () => {

    if (data.length === 0) {

      alert("No data available to export.");

      return;
    }


    const config = {

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
          item.name,
          item.age,
          item.gender,
          item.village,
          item.category,
          item.mobileNumber,
        ],
      },


      visit: {
        filename: "visit-report.csv",

        headers: [
          "Beneficiary",
          "Visit Type",
          "Visit Date",
          "Status",
          "ASHA Worker",
        ],

        rows: (item) => [
          item.beneficiaryName,
          item.visitType,
          item.visitDate,
          item.status,
          item.ashaWorker,
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
          item.beneficiaryName,
          item.bloodPressure,
          item.weight,
          item.temperature,
          item.hemoglobin,
          item.diagnosis,
          item.prescription,
          item.notes,
          item.createdAt,
        ],
      },


      inventory: {
        filename: "inventory-report.csv",

        headers: [
          "Medicine",
          "Type",
          "Batch",
          "Stock",
          "Status",
          "Expiry Date",
        ],

        rows: (item) => [
          item.name,
          item.type,
          item.batch,
          item.stock,
          item.status,
          item.expiryDate,
        ],
      },

    };


    const selected =
      config[reportType] ||
      config.beneficiary;


    const escapeCSV = (value) => {

      if (
        value === null ||
        value === undefined
      ) {
        return "";
      }

      const stringValue =
        String(value);

      return `"${stringValue.replaceAll(
        '"',
        '""'
      )}"`;
    };


    const csvContent = [

      selected.headers
        .map(escapeCSV)
        .join(","),

      ...data.map((item) =>
        selected
          .rows(item)
          .map(escapeCSV)
          .join(",")
      ),

    ].join("\n");


    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );


    const url =
      window.URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href = url;

    link.download =
      selected.filename;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };


  return (
    <button
      onClick={exportCSV}
      className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
    >

      <Download size={18} />

      Export CSV

    </button>
  );
}