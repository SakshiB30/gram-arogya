import React from "react";
import {
  Users,
  CalendarPlus,
  Activity,
  Pill,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add Beneficiary",
      icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-600",
      path: "/app/beneficiaries/add",
    },
    {
      title: "Add Visit",
      icon: CalendarPlus,
      bg: "bg-green-100",
      color: "text-green-600",
      path: "/app/visit/add",
    },
    {
      title: "Health Records",
      icon: Activity,
      bg: "bg-purple-100",
      color: "text-purple-600",
      path: "/app/health-records",
    },
    {
      title: "Medicine Inventory",
      icon: Pill,
      bg: "bg-orange-100",
      color: "text-orange-600",
      path: "/app/inventory",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">
        Quick Actions
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center rounded-xl border border-slate-200 p-6 transition hover:bg-slate-50 hover:shadow"
            >
              <div
                className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${action.bg}`}
              >
                <Icon
                  size={22}
                  className={action.color}
                />
              </div>

              <span className="text-center text-sm font-medium text-slate-700">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;