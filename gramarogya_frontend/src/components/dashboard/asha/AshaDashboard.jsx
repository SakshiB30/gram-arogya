import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { dashboardConfig } from "../config/dashboardConfig";

import DashboardHeader from "../DashboardHeader";
import StatsCards from "../StatsCards";
import QuickActions from "../QuickActions";
import RecentActivity from "../RecentActivity";
import CriticalAlerts from "../CriticalAlerts";

import UpcomingVisits from "./UpcomingVisits";

import { fetchDashboard } from "../../../redux/slices/dashboardSlice";
import { fetchTodayVisits } from "../../../redux/slices/visitSlice";

import TodaySchedule from "../../visit/TodaySchedule";


export default function AshaDashboard() {

  const dispatch = useDispatch();

  // ==============================
  // AUTH
  // ==============================

  const { user } = useSelector(
    (state) => state.auth
  );

  // ==============================
  // DASHBOARD CONFIG
  // ==============================

  const config =
    dashboardConfig[user?.role];

  // ==============================
  // DASHBOARD STATE
  // ==============================

  const {
    stats,
    recentActivities,
    alerts,
    upcomingVisits,
    loading: dashboardLoading,
    error: dashboardError,
  } = useSelector(
    (state) => state.dashboard
  );

  // ==============================
  // VISIT STATE
  // ==============================

  const {
    todayVisits = [],
    loading: visitLoading,
    error: visitError,
  } = useSelector(
    (state) => state.visit
  );

  // ==============================
  // FETCH DASHBOARD
  // ==============================

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  // ==============================
  // FETCH TODAY VISITS
  // ==============================

  useEffect(() => {
    dispatch(fetchTodayVisits());
  }, [dispatch]);

  // ==============================
  // LOADING
  // ==============================

  if (dashboardLoading || visitLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">

        <div
          className="
            h-10
            w-10
            animate-spin
            rounded-full
            border-4
            border-blue-600
            border-t-transparent
          "
        />

      </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (dashboardError || visitError) {

    const message =
      typeof dashboardError === "string"
        ? dashboardError
        : typeof visitError === "string"
        ? visitError
        : "Failed to load dashboard.";

    return (
      <div
        className="
          rounded-xl
          border
          border-red-200
          bg-red-50
          p-5
          text-red-700
        "
      >
        {message}
      </div>
    );
  }

  // ==============================
  // DASHBOARD
  // ==============================

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Header */}

      <DashboardHeader
        userName={
          user?.name ||
          stats?.userName ||
          "ASHA Worker"
        }
        roleTitle={
          config?.header?.roleTitle ||
          "ASHA Worker"
        }
        subtitle={
          config?.header?.subtitle ||
          "Manage your community health activities"
        }
      />

      {/* Statistics */}

      <StatsCards
        stats={stats}
      />

      {/* Quick Actions */}

      <QuickActions />

      {/* Today's Schedule */}

      <TodaySchedule
        visits={todayVisits}
        loading={visitLoading}
      />

      {/* Upcoming Visits */}

      <UpcomingVisits
        visits={upcomingVisits || []}
      />

      {/* Recent Activity + Alerts */}

      <div className="grid gap-6 xl:grid-cols-2">

        <RecentActivity
          activities={recentActivities || []}
        />

        <CriticalAlerts
          alerts={alerts || []}
        />

      </div>

    </div>
  );
}