import React from "react";

const RecentActivity = ({
  activities = [],
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Recent Activity
        </h2>

        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  const getDotColor = (type) => {
  switch (type) {
    case "VISIT":
      return "bg-blue-500";

    case "HEALTH_RECORD":
      return "bg-green-500";

    default:
      return "bg-slate-400";
  }
};

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-lg font-bold text-slate-900">
        Recent Activity
      </h2>

      {activities.length === 0 ? (

        <div className="py-10 text-center text-slate-500">
          No recent activities.
        </div>

      ) : (

        <div className="mt-5 space-y-5">

          {activities.map((activity) => (

            <div
              key={activity.id}
              className="flex gap-4"
            >

              <div
  className={`mt-2 h-3 w-3 rounded-full ${getDotColor(activity.type)}`}
/>

              <div className="flex-1">

                <h3 className="font-semibold text-slate-900">
                  {activity.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {activity.description}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {activity.time}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default RecentActivity;