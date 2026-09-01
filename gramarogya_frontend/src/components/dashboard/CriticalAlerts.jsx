import React from "react";
import { AlertTriangle, ChevronRight, Pill, ShieldCheck, Activity, CalendarClock } from "lucide-react";

const toneByType = {
  HIGH_RISK: { box: "border border-red-200 bg-red-50", title: "text-red-700", desc: "text-red-500", link: "text-red-700" },
  UPCOMING_VISIT: { box: "bg-slate-100", title: "text-slate-800", desc: "text-slate-500", link: "text-blue-700" },
  TB_PATIENT: { box: "bg-slate-100", title: "text-slate-800", desc: "text-slate-500", link: "text-blue-700" },
  VERIFICATION: { box: "bg-slate-100", title: "text-slate-800", desc: "text-slate-500", link: "text-blue-700" },
  MEDICINE: { box: "bg-slate-100", title: "text-slate-800", desc: "text-slate-500", link: "text-blue-700" },
  default: { box: "bg-slate-100", title: "text-slate-800", desc: "text-slate-500", link: "text-blue-700" },
};

export default function CriticalAlerts({ alerts = [] }) {
  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-red-600">
        <AlertTriangle size={20} />
        Critical Alerts
      </h2>

      {alerts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">
          <div className="mb-2 text-3xl">🎉</div>
          No critical alerts
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const tone = toneByType[alert.type] || toneByType.default;
            return (
              <div key={alert.id} className={`rounded-xl p-4 ${tone.box}`}>
                <p className={`font-semibold ${tone.title}`}>{alert.title}</p>
                <p className={`mt-1 text-sm ${tone.desc}`}>{alert.description}</p>
                {alert.actionLabel && alert.actionHref && (
                  <a
                    href={alert.actionHref}
                    className={`mt-2 inline-flex items-center gap-1 text-sm font-semibold hover:underline ${tone.link}`}
                  >
                    {alert.actionLabel} <ChevronRight size={14} />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}