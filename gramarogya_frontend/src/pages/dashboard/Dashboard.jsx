import React from "react";
import {
  ClipboardList,
  FileCheck2,
  Users,
  Archive,
  Plus,
  UserPlus,
  Megaphone,
  Syringe,
  Thermometer,
  Clock,
  ArrowUp,
  AlertTriangle,
} from "lucide-react";

// ---- Static data (swap with real data / API calls) ----
const STATS = [
  {
    label: "Today's Reports",
    value: "24",
    icon: ClipboardList,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    footer: "+3 from yesterday",
    footerIcon: ArrowUp,
    footerColor: "text-green-600",
  },
  {
    label: "Pending Verification",
    value: "12",
    icon: FileCheck2,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    footer: "Needs attention",
    footerIcon: Clock,
    footerColor: "text-amber-600",
  },
  {
    label: "Registered Patients",
    value: "1,240",
    icon: Users,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    footer: "Total active records",
    footerColor: "text-slate-500",
  },
  {
    label: "Low Stock Medicines",
    value: "8",
    icon: Archive,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    footer: "Reorder required",
    footerIcon: AlertTriangle,
    footerColor: "text-red-600",
  },
];

const QUICK_ACTIONS = [
  { label: "New Report", icon: ClipboardList, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { label: "Verify Reports", icon: FileCheck2, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  { label: "Add Patient", icon: UserPlus, iconBg: "bg-green-100", iconColor: "text-green-600" },
  { label: "Inventory", icon: Archive, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
];

const PENDING_VERIFICATION = [
  { name: "Aarav Sharma", type: "Blood Panel", date: "Today, 09:30 AM" },
  { name: "Priya Patel", type: "X-Ray Thorax", date: "Yesterday, 14:15" },
  { name: "Rahul Verma", type: "Malaria Test", date: "Yesterday, 16:45" },
];

const CRITICAL_ALERTS = [
  {
    icon: Syringe,
    title: "Polio Vaccine Shortage",
    description: "Stock below minimum threshold. Need restock by tomorrow.",
  },
  {
    icon: Thermometer,
    title: "Cold Chain Warning",
    description: "Freezer unit B temperature fluctuation detected.",
  },
];

const RECENT_ACTIVITY = [
  {
    dotColor: "bg-blue-500",
    title: "New patient registered",
    description: "Meera Devi added by ASHA Worker Suman.",
    time: "10 mins ago",
  },
  {
    dotColor: "bg-green-500",
    title: "Report Verified",
    description: "TB screening for Patient ID #4092 approved.",
    time: "1 hour ago",
  },
  {
    dotColor: "bg-slate-300",
    title: "Inventory Updated",
    description: "Paracetamol stock added (+500 units).",
    time: "3 hours ago",
  },
];

export default function Dashboard({ doctorName = "Dr. Rajesh Kumar" }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner */}
      <div className="flex items-center justify-between rounded-2xl bg-blue-50 px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {doctorName}
          </h1>
          <p className="mt-1 text-slate-500">
            Here is your primary health center overview for today.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          <Plus size={18} />
          New Report
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(
          ({
            label,
            value,
            icon: Icon,
            iconBg,
            iconColor,
            footer,
            footerIcon: FooterIcon,
            footerColor,
          }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {label}
                </span>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBg}`}
                >
                  <Icon size={18} className={iconColor} />
                </span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900">
                {value}
              </div>
              <div
                className={`mt-2 flex items-center gap-1 text-sm font-medium ${footerColor}`}
              >
                {FooterIcon && <FooterIcon size={14} />}
                {footer}
              </div>
            </div>
          )
        )}
      </div>

      {/* Middle section: Quick actions + Critical alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {QUICK_ACTIONS.map(({ label, icon: Icon, iconBg, iconColor }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 py-6 hover:bg-slate-50"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${iconBg}`}
                >
                  <Icon size={20} className={iconColor} />
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Critical alerts */}
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <div className="flex items-center gap-2">
            <Megaphone size={18} className="text-red-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Critical Alerts
            </h2>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {CRITICAL_ALERTS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex gap-3 rounded-xl border border-red-100 bg-white p-4"
              >
                <Icon size={20} className="mt-0.5 shrink-0 text-red-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {title}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section: Pending verification + Recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pending verification table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Pending Verification
            </h2>
            <button className="text-sm font-semibold text-blue-600 hover:underline">
              View All
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 font-semibold">Patient Name</th>
                  <th className="pb-3 font-semibold">Report Type</th>
                  <th className="pb-3 font-semibold">Date submitted</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {PENDING_VERIFICATION.map(({ name, type, date }) => (
                  <tr key={name} className="border-b border-slate-100 last:border-0">
                    <td className="py-4 font-medium text-slate-900">{name}</td>
                    <td className="py-4 text-slate-600">{type}</td>
                    <td className="py-4 text-slate-600">{date}</td>
                    <td className="py-4 text-right">
                      <button className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50">
                        Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          <div className="mt-4 flex flex-col gap-5">
            {RECENT_ACTIVITY.map(({ dotColor, title, description, time }) => (
              <div key={title} className="flex gap-3">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotColor}`} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {title}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">{description}</p>
                  <p className="mt-1 text-xs text-slate-400">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}