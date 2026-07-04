import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  ClipboardList,
  BarChart2,
  FileCheck2,
  Users,
  Archive,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, path: "/app/dashboard" },
  { label: "Daily Report", icon: ClipboardList, path: "/app/daily-report" },
  { label: "My Reports", icon: BarChart2, path: "/app/my-reports" },
  { label: "Verify Reports", icon: FileCheck2, path: "/app/verify-reports" },
  { label: "Patients", icon: Users, path: "/app/patients" },
  { label: "Medicine Inventory", icon: Archive, path: "/app/medicine-inventory" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen w-70 flex-col justify-between border-r border-slate-200 bg-white px-4 py-6">

      <div>
        <div className="px-2">
          <h1 className="text-2xl font-extrabold text-blue-600">
            SwasthSetu
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            PHC Management
          </p>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;

            return (
              <button
                key={label}
                onClick={() => onNavigate(path)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon size={20} strokeWidth={2} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

    </div>
  );
};

export default Sidebar;