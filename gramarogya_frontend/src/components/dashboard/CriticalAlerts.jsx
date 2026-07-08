import React from "react";
import {
  AlertTriangle,
  Syringe,
  Thermometer,
    CalendarClock,
    Activity,
} from "lucide-react";

const CriticalAlerts = ({ alerts = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case "VACCINE":
        return Syringe;

      case "TEMPERATURE":
        return Thermometer;

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

  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm">

      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
        <AlertTriangle className="text-red-600" size={20} />
        Critical Alerts
      </h2>

      <div className="mt-5 space-y-4">

        {alerts.map((alert) => {
          const Icon = getIcon(alert.type);

          return (
            <div
              key={alert.id}
              className="flex gap-4 rounded-xl border border-red-100 bg-white p-4"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
                <Icon
                  className="text-red-600"
                  size={20}
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  {alert.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {alert.description}
                </p>

                <p className="mt-2 text-xs text-red-600">
                  {alert.time}
                </p>
              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
};

export default CriticalAlerts;