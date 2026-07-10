import { Download } from "lucide-react";

export default function ExportButton({
  data = [],
}) {

  const exportCSV = () => {

    if (data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = [
      "Name",
      "Age",
      "Gender",
      "Village",
      "Category",
      "Mobile Number",
    ];

    const rows = data.map((item) => [
      item.name,
      item.age,
      item.gender,
      item.village,
      item.category,
      item.mobileNumber,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
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
      "beneficiary-report.csv";

    link.click();

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