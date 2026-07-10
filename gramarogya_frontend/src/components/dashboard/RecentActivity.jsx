import React from "react";
import {
  UserPlus,
  CalendarCheck,
  Activity,
  Pill,
} from "lucide-react";

export default function RecentActivities({
  recentBeneficiaries = [],
  recentVisits = [],
  recentHealthRecords = [],
  recentMedicines = [],
}) {
  const activities = [];

  recentBeneficiaries.forEach((item) =>
    activities.push({
      title: `New beneficiary added`,
      subtitle: item.name,
      date: item.dateAdded,
      icon: UserPlus,
      color: "bg-blue-100 text-blue-600",
    })
  );

  recentVisits.forEach((item) =>
    activities.push({
      title: `Visit completed`,
      subtitle: item.visitType,
      date: item.visitDate,
      icon: CalendarCheck,
      color: "bg-green-100 text-green-600",
    })
  );

  recentHealthRecords.forEach((item) =>
    activities.push({
      title: `Health record added`,
      subtitle: item.diagnosis || "Health Record",
      date: item.createdAt,
      icon: Activity,
      color: "bg-purple-100 text-purple-600",
    })
  );

  recentMedicines.forEach((item) =>
    activities.push({
      title: `Medicine Updated`,
      subtitle: item.name,
      date: item.updatedAt,
      icon: Pill,
      color: "bg-orange-100 text-orange-600",
    })
  );

  activities.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const latest = activities.slice(0, 8);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">
        Recent Activities
      </h2>

      <div className="mt-5 space-y-4">

        {latest.length === 0 ? (
          <p className="text-sm text-slate-500">
            No recent activity available.
          </p>
        ) : (
          latest.map((activity, index) => {
            const Icon = activity.icon;

            return (
              <div
                key={index}
                className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 hover:bg-slate-50"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${activity.color}`}
                >
                  <Icon size={20} />
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
          })
        )}

      </div>
    </div>
  );
}