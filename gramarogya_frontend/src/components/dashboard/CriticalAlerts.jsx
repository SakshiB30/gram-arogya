import React from "react";
import {
  AlertTriangle,
  CalendarClock,
  Activity,
  ShieldCheck,
  Pill,
} from "lucide-react";

export default function CriticalAlerts({ alerts = [] }) {

  // =========================================================
  // ICON BASED ON ALERT TYPE
  // =========================================================

  const getIcon = (type) => {
    switch (type) {
      case "HIGH_RISK":
        return AlertTriangle;

      case "UPCOMING_VISIT":
        return CalendarClock;

      case "TB_PATIENT":
        return Activity;

      case "VERIFICATION":
        return ShieldCheck;

      case "MEDICINE":
        return Pill;

      default:
        return AlertTriangle;
    }
  };


  // =========================================================
  // ICON COLOR BASED ON ALERT TYPE
  // =========================================================

  const getIconStyle = (type) => {
    switch (type) {

      case "UPCOMING_VISIT":
        return {
          bg: "bg-yellow-100",
          color: "text-yellow-600",
        };

      case "MEDICINE":
        return {
          bg: "bg-orange-100",
          color: "text-orange-600",
        };

      case "VERIFICATION":
        return {
          bg: "bg-blue-100",
          color: "text-blue-600",
        };

      case "TB_PATIENT":
        return {
          bg: "bg-purple-100",
          color: "text-purple-600",
        };

      case "HIGH_RISK":
      default:
        return {
          bg: "bg-red-100",
          color: "text-red-600",
        };
    }
  };


  // =========================================================
  // PRIORITY STYLE
  // =========================================================

  const getPriorityStyle = (priority) => {

    switch (priority) {

      case "HIGH":
        return "bg-red-100 text-red-700";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";

      case "LOW":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };


  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (alerts.length === 0) {

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">

          <AlertTriangle
            className="text-red-600"
            size={20}
          />

          Critical Alerts

        </h2>


        <div className="mt-8 py-6 text-center text-slate-500">

          <div className="mb-2 text-3xl">
            🎉
          </div>

          No critical alerts

        </div>

      </div>
    );
  }


  // =========================================================
  // ALERT LIST
  // =========================================================

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">

        <AlertTriangle
          className="text-red-600"
          size={20}
        />

        Critical Alerts

        <span className="ml-auto rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
          {alerts.length}
        </span>

      </h2>


      {/* =====================================================
          ALERT LIST
      ===================================================== */}

      <div className="space-y-4">

        {alerts.map((alert) => {

          const Icon = getIcon(alert.type);

          const iconStyle =
            getIconStyle(alert.type);


          return (

            <div
              key={alert.id}
              className="
                flex
                gap-4
                rounded-xl
                border
                border-slate-100
                bg-white
                p-4
                transition
                hover:bg-slate-50
              "
            >

              {/* =================================================
                  ALERT ICON
              ================================================= */}

              <div
                className={`
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  ${iconStyle.bg}
                `}
              >

                <Icon
                  size={20}
                  className={iconStyle.color}
                />

              </div>


              {/* =================================================
                  ALERT INFORMATION
              ================================================= */}

              <div className="min-w-0 flex-1">

                <div className="flex items-start justify-between gap-3">

                  <h3 className="font-semibold text-slate-900">

                    {alert.title}

                  </h3>


                  {/* =================================================
                      PRIORITY
                  ================================================= */}

                  {alert.priority && (

                    <span
                      className={`
                        shrink-0
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        ${getPriorityStyle(alert.priority)}
                      `}
                    >

                      {alert.priority}

                    </span>

                  )}

                </div>


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <p className="mt-2 text-sm leading-5 text-slate-600">

                  {alert.description}

                </p>


                {/* =================================================
                    TYPE
                ================================================= */}

                {alert.type && (

                  <span className="mt-2 inline-block text-xs font-medium uppercase tracking-wide text-slate-400">

                    {alert.type.replaceAll("_", " ")}

                  </span>

                )}

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}
