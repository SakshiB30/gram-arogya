// src/components/Landing/MiniDashboardPreview.jsx
import { Users, HeartPulse, Package, Activity } from "lucide-react";

export default function MiniDashboardPreview() {
  return (
    <div className="mt-5 rounded-xl border border-slate-200/60 bg-slate-50/80 p-4 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">PHC Dashboard</p>
          <h4 className="text-sm font-semibold text-slate-900">Today's Overview</h4>
        </div>
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
          Live
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-slate-500">Beneficiaries</span>
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">248</p>
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-red-500" />
            <span className="text-xs text-slate-500">Visits</span>
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">34</p>
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-slate-500">Medicines</span>
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">156</p>
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600" />
            <span className="text-xs text-slate-500">Reports</span>
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">18</p>
        </div>
      </div>

      {/* Bottom Progress */}
      <div className="mt-5">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-slate-500">Daily Reporting</span>
          <span className="font-semibold text-emerald-600">98%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
        </div>
      </div>
    </div>
  );
}