import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-green-100 text-green-700",
  Returned: "bg-red-100 text-red-700",
};

const REPORTS = [
  { date: "24 Oct 2023", village: "Rampur", status: "Pending", submittedBy: "Asha Devi" },
  { date: "23 Oct 2023", village: "Sitapur", status: "Approved", submittedBy: "Sunita Kumari" },
  { date: "23 Oct 2023", village: "Lakhimpur", status: "Returned", submittedBy: "Meena Yadav" },
  { date: "22 Oct 2023", village: "Rampur", status: "Pending", submittedBy: "Asha Devi" },
  { date: "21 Oct 2023", village: "Sitapur", status: "Approved", submittedBy: "Geeta Singh" },
];

const VILLAGES = ["All Villages", "Rampur", "Sitapur", "Lakhimpur"];
const STATUSES = ["All Status", "Pending", "Approved", "Returned"];

export default function VerifyReports({ onView = () => {}, onEdit = () => {} }) {
  const [village, setVillage] = useState("All Villages");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const totalPages = 3;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Verify Reports</h1>
          <p className="mt-1 text-slate-500">
            Review and approve field health worker submissions.
          </p>
        </div>

        <div className="flex gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Village
            </label>
            <div className="relative">
              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-44 appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {VILLAGES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-44 appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-blue-50/60 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Village</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Submitted By</th>
              <th className="px-6 py-4 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {REPORTS.map((r, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-6 py-4 font-medium text-slate-900">{r.date}</td>
                <td className="px-6 py-4 text-slate-700">{r.village}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[r.status]}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-700">{r.submittedBy}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onView(r)}
                    className="mr-4 text-sm font-semibold text-blue-600 hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(r)}
                    className="text-sm font-semibold text-slate-500 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div className="flex items-center justify-between bg-blue-50/60 px-6 py-4">
          <p className="text-sm text-slate-500">Showing 1 to 5 of 42 entries</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold ${
                  page === p ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-white"
                }`}
              >
                {p}
              </button>
            ))}
            <span className="px-1 text-slate-400">...</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}