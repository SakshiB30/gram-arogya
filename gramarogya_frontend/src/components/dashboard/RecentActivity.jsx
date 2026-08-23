import React, { useState } from "react";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function RecentActivity({ activities = [] }) {
  const ITEMS_PER_LOAD = 5;

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

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

  const getActionIcon = (action) => {
    switch (action) {
      case "CREATE":
        return Plus;

      case "UPDATE":
        return Edit;

      case "DELETE":
        return Trash2;

      case "COMPLETE":
      case "VERIFY":
        return CheckCircle;

      case "ASSIGN":
        return UserPlus;

      default:
        return null;
    }
  };

  const visibleActivities = activities.slice(0, visibleCount);

  const hasMore = visibleCount < activities.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + ITEMS_PER_LOAD, activities.length)
    );
  };

  const handleShowLess = () => {
    setVisibleCount(ITEMS_PER_LOAD);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          Recent Activity
        </h2>

        {activities.length > ITEMS_PER_LOAD && (
          <span className="text-xs font-medium text-slate-400">
            Showing {visibleActivities.length} of {activities.length}
          </span>
        )}
      </div>

      {/* Empty State */}
      {activities.length === 0 ? (
        <div className="py-10 text-center text-slate-500">
          No recent activity found.
        </div>
      ) : (
        <>
          {/* Activities */}
          <div className="space-y-3">
            {visibleActivities.map((activity) => {
              const item = getIcon(activity.type);
              const Icon = item.icon;
              const ActionIcon = getActionIcon(activity.action);

              return (
                <div
                  key={activity.id}
                  className="
                    group
                    flex
                    items-center
                    gap-4
                    rounded-xl
                    border
                    border-slate-100
                    p-4
                    transition-all
                    duration-200
                    hover:border-slate-200
                    hover:bg-slate-50
                    hover:shadow-sm
                  "
                >
                  {/* Activity Icon */}
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
                      transition-transform
                      duration-200
                      group-hover:scale-110
                      ${item.bg}
                    `}
                  >
                    <Icon
                      size={20}
                      className={item.color}
                    />

                    {/* Action Icon */}
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
                          shadow-sm
                        "
                      >
                        <ActionIcon
                          size={11}
                          className={item.color}
                        />
                      </div>
                    )}
                  </div>

                  {/* Activity Details */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-slate-800">
                      {activity.title}
                    </h4>

                    <p className="truncate text-sm text-slate-500">
                      {activity.description}
                    </p>

                    {activity.action && (
                      <span className="mt-1 inline-block text-xs font-medium text-slate-400">
                        {activity.action}
                      </span>
                    )}
                  </div>

                  {/* Time */}
                  <span className="shrink-0 text-xs text-slate-400">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Load More / Show Less */}
          {activities.length > ITEMS_PER_LOAD && (
            <div className="mt-5 flex justify-center">
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-600
                    transition-all
                    duration-200
                    hover:border-blue-200
                    hover:bg-blue-50
                    hover:text-blue-600
                  "
                >
                  Load More
                  <ChevronDown size={16} />
                </button>
              ) : (
                <button
                  onClick={handleShowLess}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-600
                    transition-all
                    duration-200
                    hover:border-blue-200
                    hover:bg-blue-50
                    hover:text-blue-600
                  "
                >
                  Show Less
                  <ChevronUp size={16} />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}