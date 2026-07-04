import React, { useState } from "react";
import { Filter, Clock, Printer, XCircle, RotateCcw, CheckCircle2 } from "lucide-react";

const BADGE_STYLES = {
  Urgent: "bg-orange-100 text-orange-700",
  Routine: "bg-blue-100 text-blue-700",
  "Follow-up": "bg-amber-800/10 text-amber-800",
};

const INBOX = [
  {
    id: "RPT-2023-891",
    title: "Maternal Health Vitals - Asha Devi",
    badge: "Urgent",
    time: "2 hrs ago",
    submittedBy: "FW-04",
  },
  {
    id: "RPT-2023-890",
    title: "Immunization Record - Village B",
    badge: "Routine",
    time: "5 hrs ago",
    submittedBy: "FW-12",
  },
  {
    id: "RPT-2023-889",
    title: "Tuberculosis Screening - Ram Singh",
    badge: "Follow-up",
    time: "1 day ago",
    submittedBy: "FW-02",
  },
  {
    id: "RPT-2023-888",
    title: "Malaria Surveillance Data",
    badge: "Routine",
    time: "1 day ago",
    submittedBy: "FW-07",
  },
];

const REPORT_DETAIL = {
  "RPT-2023-891": {
    title: "Maternal Health Vitals - Asha Devi",
    submitted: "Oct 24, 2023, 09:15 AM",
    vitals: [
      { label: "Blood Pressure", value: "145/90", note: "Elevated", noteColor: "text-red-600" },
      { label: "Weight", value: "62 kg", note: "+2kg from last visit", noteColor: "text-slate-500" },
      { label: "Hemoglobin", value: "11.2 g/dL", note: "Normal Range", noteColor: "text-slate-500" },
    ],
    patientName: "Asha Devi",
    age: "26 Yrs / 32 Weeks",
    notes:
      "Patient complains of slight swelling in ankles and occasional mild headaches over the last two days.",
    attachment:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&q=60",
  },
};

export default function ReportReview({ initialReportId = "RPT-2023-891" }) {
  const [selectedId, setSelectedId] = useState(initialReportId);
  const [remarks, setRemarks] = useState("");
  const detail = REPORT_DETAIL[selectedId] || REPORT_DETAIL["RPT-2023-891"];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Pending Inbox */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Pending Inbox</h2>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
            <Filter size={16} />
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-1">
          {INBOX.map((item) => {
            const isActive = item.id === selectedId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`rounded-xl border-l-4 px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "border-blue-600 bg-blue-50"
                    : "border-transparent hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">{item.id}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_STYLES[item.badge]}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-900">{item.title}</p>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={12} />
                  <span>{item.time}</span>
                  <span className="ml-1">Submitted by: {item.submittedBy}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report detail / review panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{detail.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              Report ID:{" "}
              <span className="font-medium text-blue-600">{selectedId}</span>
              {"  "}&bull; Submitted: {detail.submitted}
            </p>
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
            <Printer size={18} />
          </button>
        </div>

        {/* Vitals */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {detail.vitals.map((v) => (
            <div key={v.label} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-500">{v.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{v.value}</p>
              <p className={`mt-0.5 text-sm font-medium ${v.noteColor}`}>{v.note}</p>
            </div>
          ))}
        </div>

        {/* Patient info table */}
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
          <div className="flex border-b border-slate-100 px-5 py-3">
            <span className="w-48 text-sm font-medium text-slate-500">Patient Name</span>
            <span className="text-sm font-semibold text-slate-900">{detail.patientName}</span>
          </div>
          <div className="flex border-b border-slate-100 px-5 py-3">
            <span className="w-48 text-sm font-medium text-slate-500">Age / Gestational Age</span>
            <span className="text-sm font-semibold text-slate-900">{detail.age}</span>
          </div>
          <div className="flex px-5 py-3">
            <span className="w-48 shrink-0 text-sm font-medium text-slate-500">Field Worker Notes</span>
            <span className="text-sm text-slate-700">{detail.notes}</span>
          </div>
        </div>

        {/* Attached documentation */}
        <div className="mt-5">
          <h3 className="text-sm font-bold text-slate-900">Attached Documentation</h3>
          <img
            src={detail.attachment}
            alt="Attached documentation"
            className="mt-2 h-40 w-40 rounded-lg border border-slate-200 object-cover"
          />
        </div>

        {/* Officer remarks */}
        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-900">
            Officer Remarks (Required for rejection/return)
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter clinical notes, instructions for field worker, or reasons for rejection..."
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action buttons */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700">
            <XCircle size={18} />
            Reject
          </button>
          <button className="flex items-center justify-center gap-2 rounded-xl bg-amber-800 py-3 text-sm font-semibold text-white hover:bg-amber-900">
            <RotateCcw size={18} />
            Return for Correction
          </button>
          <button className="flex items-center justify-center gap-2 rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-800">
            <CheckCircle2 size={18} />
            Approve Report
          </button>
        </div>
      </div>
    </div>
  );
}