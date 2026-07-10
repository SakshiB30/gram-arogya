import React from "react";
import {
  AlertTriangle,
  CalendarClock,
  Activity,
} from "lucide-react";

export default function CriticalAlerts({ alerts = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case "HIGH_RISK":
        return AlertTriangle;

      case "UPCOMING_VISIT":
        return CalendarClock;

      case "TB_PATIENT":
        return Activity;

      default:
        return AlertTriangle;
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Critical Alerts
        </h2>

        <div className="mt-8 text-center text-slate-500">
          No critical alerts 🎉
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm">

      <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
        <AlertTriangle
          className="text-red-600"
          size={20}
        />
        Critical Alerts
      </h2>

      <div className="space-y-4">

        {alerts.map((alert) => {
          const Icon = getIcon(alert.type);

          return (
            <div
              key={alert.id}
              className="flex gap-4 rounded-xl border border-red-100 bg-white p-4"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
                <Icon
                  size={20}
                  className="text-red-600"
                />
              </div>

              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <h3 className="font-semibold text-slate-900">
                    {alert.title}
                  </h3>

                  <span
  className={`rounded-full px-3 py-1 text-xs font-semibold ${
    alert.priority === "HIGH"
      ? "bg-red-100 text-red-700"
      : alert.priority === "MEDIUM"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700"
  }`}
>
  {alert.priority}
</span>

                </div>

                <p className="mt-2 text-sm text-slate-600">
                  {alert.description}
                </p>

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}