import React from "react";
import {
  UserPlus,
  UserRound,
  CalendarCheck,
  Activity,
  Pill,
  FolderKanban,
  CheckCircle,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

export default function RecentActivity({
  activities = [],
}) {

  // =========================================================
  // ICON + COLOR BASED ON ACTIVITY TYPE
  // =========================================================

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

      case "USER":
        return {
          icon: UserRound,
          bg: "bg-indigo-100",
          color: "text-indigo-600",
        };

      case "MEDICINE":
        return {
          icon: Pill,
          bg: "bg-orange-100",
          color: "text-orange-600",
        };

      case "PROJECT":
        return {
          icon: FolderKanban,
          bg: "bg-cyan-100",
          color: "text-cyan-600",
        };

      default:
        return {
          icon: Activity,
          bg: "bg-slate-100",
          color: "text-slate-600",
        };
    }
  };


  // =========================================================
  // ACTION ICON
  // =========================================================

  const getActionIcon = (action) => {

    switch (action) {

      case "CREATE":
        return Plus;

      case "UPDATE":
        return Edit;

      case "DELETE":
        return Trash2;

      case "COMPLETE":
        return CheckCircle;

      case "VERIFY":
        return CheckCircle;

      case "ASSIGN":
        return UserPlus;

      default:
        return null;
    }
  };


  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <h2 className="mb-6 text-lg font-bold text-slate-900">
        Recent Activity
      </h2>


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {activities.length === 0 ? (

        <div className="py-10 text-center text-slate-500">
          No recent activity found.
        </div>

      ) : (

        <div className="space-y-4">

          {activities.map((activity) => {

            const item = getIcon(activity.type);

            const Icon = item.icon;

            const ActionIcon =
              getActionIcon(activity.action);


            return (

              <div
                key={activity.id}
                className="
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  border
                  border-slate-100
                  p-4
                  transition
                  hover:bg-slate-50
                "
              >

                {/* =================================================
                    MAIN ACTIVITY ICON
                ================================================= */}

                <div
                  className={`
                    relative
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${item.bg}
                  `}
                >

                  <Icon
                    size={20}
                    className={item.color}
                  />


                  {/* Small action badge */}

                  {ActionIcon && (

                    <div
                      className="
                        absolute
                        -right-1
                        -bottom-1
                        flex
                        h-5
                        w-5
                        items-center
                        justify-center
                        rounded-full
                        border-2
                        border-white
                        bg-white
                      "
                    >

                      <ActionIcon
                        size={11}
                        className={item.color}
                      />

                    </div>

                  )}

                </div>


                {/* =================================================
                    ACTIVITY INFORMATION
                ================================================= */}

                <div className="min-w-0 flex-1">

                  <h4 className="font-semibold text-slate-800">
                    {activity.title}
                  </h4>


                  <p className="truncate text-sm text-slate-500">
                    {activity.description}
                  </p>


                  {/* Optional action */}

                  {activity.action && (

                    <span
                      className="
                        mt-1
                        inline-block
                        text-xs
                        font-medium
                        text-slate-400
                      "
                    >
                      {activity.action}
                    </span>

                  )}

                </div>


                {/* =================================================
                    DATE
                ================================================= */}

                <span
                  className="
                    shrink-0
                    text-xs
                    text-slate-400
                  "
                >
                  {activity.time}
                </span>

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
}