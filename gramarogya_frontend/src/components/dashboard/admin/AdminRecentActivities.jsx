import { Activity } from "lucide-react";

export default function AdminRecentActivities({
  activities,
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-2">
        <Activity
          className="text-green-600"
          size={22}
        />

        <h2 className="text-lg font-semibold">
          Recent Activities
        </h2>
      </div>

      {activities.length === 0 ? (

        <div className="py-10 text-center text-slate-400">
          No recent activities
        </div>

      ) : (

        <div className="space-y-4">

          {activities.map((activity) => (

            <div
              key={activity.id}
              className="rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
            >

              <div className="flex items-start justify-between">

                <div>

                  <h3 className="font-semibold text-slate-800">
                    {activity.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {activity.description}
                  </p>

                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {activity.type}
                </span>

              </div>

              <p className="mt-3 text-xs text-slate-400">
                {activity.time}
              </p>

            </div>

          ))}

        </div>
      )}
    </div>
  );
}