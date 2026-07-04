import React from "react";
import { Users, User, Smile, ArrowUp, ArrowDown, ChevronRight } from "lucide-react";

const STATS = [
  {
    label: "Total Patients",
    value: "4,289",
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "+12% this month",
    badgeIcon: ArrowUp,
  },
  {
    label: "Pregnant Women",
    value: "342",
    icon: User,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    badge: "+3 new today",
    badgeIcon: ArrowUp,
  },
  {
    label: "Children Under 5",
    value: "856",
    icon: Smile,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    badge: "-2% severe cases",
    badgeIcon: ArrowDown,
  },
];

const PATIENTS = [
  { name: "Ramesh Patel", id: "P-2023-8942", age: "45 Yrs, Male", village: "Rampur", status: "Active" },
  { name: "Sunita Kumari", id: "P-2023-8941", age: "29 Yrs, Female", village: "Sitapur", status: "Active" },
  { name: "Asha Devi", id: "P-2023-8938", age: "26 Yrs, Female", village: "Rampur", status: "Pregnant" },
  { name: "Meena Yadav", id: "P-2023-8930", age: "6 Yrs, Female", village: "Lakhimpur", status: "Active" },
];

const STATUS_STYLES = {
  Active: "bg-green-100 text-green-700",
  Pregnant: "bg-orange-100 text-orange-700",
};

export default function Patients({ onOpenPatient = () => {} }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
        <p className="mt-1 text-slate-500">Overview of registered patients across all villages.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {STATS.map(({ label, value, icon: Icon, iconBg, iconColor, badge, badgeIcon: BadgeIcon }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}>
                <Icon size={22} className={iconColor} />
              </span>
              <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                <BadgeIcon size={12} />
                {badge}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Patient list table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">All Patients</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3 font-semibold">Patient</th>
              <th className="px-6 py-3 font-semibold">Age / Gender</th>
              <th className="px-6 py-3 font-semibold">Village</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {PATIENTS.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.id}</p>
                </td>
                <td className="px-6 py-4 text-slate-700">{p.age}</td>
                <td className="px-6 py-4 text-slate-700">{p.village}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onOpenPatient(p)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                  >
                    View <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}