import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  ClipboardList,
  BarChart2,
  FileCheck2,
  Users,
  Archive,
  Stethoscope,
  LifeBuoy,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, path: "/app/dashboard" },
  { label: "Daily Report", icon: ClipboardList, path: "/app/daily-report" },
  { label: "My Reports", icon: BarChart2, path: "/app/my-reports" },
  { label: "Verify Reports", icon: FileCheck2, path: "/app/verify-reports" },
  { label: "Beneficiaries", icon: Users, path: "/app/beneficiary" },
  { label: "Medicine Inventory", icon: Archive, path: "/app/medicine-inventory" },
];

const Sidebar = ({ userRole = "ASHA Worker", facilityName = "Primary Health Centre" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const onNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen w-72 flex-col justify-between border-r border-slate-200 bg-white">
      <div>
        {/* Brand */}
        <div className="border-b border-slate-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-blue-500 shadow-md shadow-violet-500/20">
              <Stethoscope className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-slate-900">
                GramArogya
              </h1>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                PHC Management System
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-linear-to-r from-violet-50 to-blue-50 px-3 py-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-violet-400">
              Facility
            </p>
            <p className="text-sm font-semibold text-slate-700">{facilityName}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navItems.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;

            return (
              <button
                key={label}
                onClick={() => onNavigate(path)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14.5px] font-medium transition-colors ${
                  isActive
                    ? "bg-linear-to-r from-violet-600 to-blue-600 text-white shadow-md shadow-violet-600/20"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={2}
                  className={isActive ? "text-white" : "text-slate-400"}
                />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer: role + support */}
      <div className="border-t border-slate-100 px-4 py-4">
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-slate-600">{userRole}</span>
        </div>
        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-violet-600">
          <LifeBuoy size={15} />
          Help &amp; support
        </button>
        <p className="mt-3 px-3 text-[10.5px] leading-relaxed text-slate-400">
          GramArogya Health Information System · Data secured under IT Act, 2000
        </p>
      </div>
    </div>
  );
};

export default Sidebar;