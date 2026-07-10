import React from "react";
import {
  UserPlus,
  CalendarCheck,
  Activity,
} from "lucide-react";

export default function RecentActivity({
  activities = [],
}) {
  const getIcon = (type) => {
    switch (type) {
      case "BENEFICIARY":
        return {
          icon: UserPlus,
          bg: "bg-blue-100",
          color: "text-blue-600",
        };

      case "VISIT":
        return {
          icon: CalendarCheck,
          bg: "bg-green-100",
          color: "text-green-600",
        };

      case "HEALTH_RECORD":
        return {
          icon: Activity,
          bg: "bg-purple-100",
          color: "text-purple-600",
        };

      default:
        return {
          icon: Activity,
          bg: "bg-slate-100",
          color: "text-slate-600",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-lg font-bold text-slate-900">
        Recent Activity
      </h2>

      {activities.length === 0 ? (

        <div className="py-10 text-center text-slate-500">
          No recent activity found.
        </div>

      ) : (

        <div className="space-y-4">

          {activities.map((activity, index) => {

            const item = getIcon(activity.type);
            const Icon = item.icon;

            return (

              <div
                key={index}
                className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
              >

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${item.bg}`}
                >
                  <Icon
                    size={20}
                    className={item.color}
                  />
                </div>

                <div className="flex-1">

                  <h4 className="font-semibold text-slate-800">
                    {activity.title}
                  </h4>

                  <p className="text-sm text-slate-500">
                    {activity.subtitle}
                  </p>

                </div>

                <span className="text-xs text-slate-400">
                  {activity.date}
                </span>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}