import React from "react";
import {
  FileText,
  Activity,
  ClipboardList,
  Syringe,
  ArrowDown,
  AlertTriangle,
  Printer,
  Plus,
} from "lucide-react";

const DEFAULT_PATIENT = {
  name: "Ramesh Patel",
  id: "P-2023-8942",
  gender: "Male",
  age: "45 Years",
  status: "Active",
  phone: "+91 98765 43210",
  aadhaar: "XXXX XXXX 1234",
  address: "14, Gandhi Gram, Sector 4, Rural Block",
  bloodGroup: "O+",
  vitalsDate: "Oct 12, 2023",
  vitals: [
    {
      label: "Blood Pressure",
      value: "120/80",
      note: "Normal",
      noteIcon: ArrowDown,
      noteColor: "text-green-600",
    },
    {
      label: "Blood Sugar (F)",
      value: "145",
      note: "High",
      noteIcon: AlertTriangle,
      noteColor: "text-red-600",
    },
    { label: "Weight", value: "72 kg", note: null },
    { label: "Temp", value: "98.6 °F", note: null },
  ],
  medicalHistory: [
    {
      icon: AlertTriangle,
      iconColor: "text-red-600",
      condition: "Type 2 Diabetes Mellitus",
      detail: "Diagnosed: 2018. Currently managing with oral medication.",
    },
    {
      icon: FileText,
      iconColor: "text-slate-400",
      condition: "Hypertension",
      detail: "Diagnosed: 2020. Stable on current dosage.",
    },
  ],
  vaccinations: [
    { name: "COVID-19 (Booster)", date: "Jan 15, 2023", status: "Completed" },
    { name: "Flu Shot Annual", date: "Sep 10, 2023", status: "Completed" },
  ],
};

export default function PatientDetail({
  patient = DEFAULT_PATIENT,
  onPrint = () => {},
  onAddVisit = () => {},
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{patient.name}</h1>
          <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-500">
            <span>ID: {patient.id}</span>
            <span>&bull;</span>
            <span>
              {patient.gender}, {patient.age}
            </span>
            <span>&bull;</span>
            <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">
              {patient.status}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onPrint}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Printer size={16} />
            Print Record
          </button>
          <button
            onClick={onAddVisit}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Add New Visit
          </button>
        </div>
      </div>

      {/* Top row: Personal info + Latest vitals */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Personal Info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-slate-400" />
            <h2 className="text-base font-bold text-slate-900">Personal Info</h2>
          </div>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            {[
              { label: "Phone:", value: patient.phone },
              { label: "Aadhaar:", value: patient.aadhaar },
              { label: "Address:", value: patient.address },
              { label: "Blood Grp:", value: patient.bloodGroup },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4">
                <span className="w-24 shrink-0 font-medium text-slate-500">{label}</span>
                <span className="text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Vitals */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-slate-400" />
            <h2 className="text-base font-bold text-slate-900">
              Latest Vitals ({patient.vitalsDate})
            </h2>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {patient.vitals.map(({ label, value, note, noteIcon: NoteIcon, noteColor }) => (
              <div key={label} className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
                {note && (
                  <p className={`mt-0.5 flex items-center gap-1 text-xs font-semibold ${noteColor}`}>
                    {NoteIcon && <NoteIcon size={12} />}
                    {note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Medical History + Vaccination History */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Medical History */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-slate-400" />
            <h2 className="text-base font-bold text-slate-900">Medical History</h2>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {patient.medicalHistory.map(
              ({ icon: Icon, iconColor, condition, detail }) => (
                <div key={condition} className="flex gap-3">
                  <Icon size={18} className={`mt-0.5 shrink-0 ${iconColor}`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{condition}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{detail}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Vaccination History */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Syringe size={18} className="text-slate-400" />
            <h2 className="text-base font-bold text-slate-900">Vaccination History</h2>
          </div>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-3 font-semibold">Vaccine</th>
                <th className="pb-3 font-semibold">Date Given</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {patient.vaccinations.map(({ name, date, status }) => (
                <tr key={name} className="border-t border-slate-100">
                  <td className="py-3 font-medium text-slate-900">{name}</td>
                  <td className="py-3 text-slate-600">{date}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}