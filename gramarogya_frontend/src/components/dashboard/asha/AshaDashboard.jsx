import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { dashboardConfig } from "../config/dashboardConfig";

import DashboardHeader from "../DashboardHeader";
import StatsCards from "../StatsCards";
import QuickActions from "../QuickActions";
import CriticalAlerts from "../CriticalAlerts";
import HealthPrograms from "../HealthPrograms";

import TodaySchedule from "../../visit/TodaySchedule";

import { fetchDashboard } from "../../../redux/slices/dashboardSlice";
import { fetchTodayVisits } from "../../../redux/slices/visitSlice";

export default function AshaDashboard() {
  const dispatch = useDispatch();

  // =====================================================
  // AUTH
  // =====================================================

  const { user } = useSelector((state) => state.auth);

  const config = dashboardConfig?.[user?.role];


  // =====================================================
  // DASHBOARD STATE
  // =====================================================

  const {
    stats,
    alerts = [],
    healthPrograms = [],
    loading: dashboardLoading,
    error: dashboardError,
  } = useSelector((state) => state.dashboard);


  // =====================================================
  // VISIT STATE
  // =====================================================

  const {
    todayVisits = [],
    loading: visitLoading,
    error: visitError,
  } = useSelector((state) => state.visit);


  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);


  // =====================================================
  // FETCH TODAY'S VISITS
  // =====================================================

  useEffect(() => {
    dispatch(fetchTodayVisits());
  }, [dispatch]);


  // =====================================================
  // CRITICAL ALERTS
  // Only HIGH priority alerts are considered critical
  // =====================================================

  const criticalAlerts = (alerts || []).filter(
    (alert) =>
      alert?.priority?.toUpperCase() === "HIGH"
  );


  // =====================================================
  // LOADING
  // =====================================================

  if (dashboardLoading || visitLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (dashboardError || visitError) {
    const message =
      typeof dashboardError === "string"
        ? dashboardError
        : typeof visitError === "string"
        ? visitError
        : "Failed to load dashboard.";

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        {message}
      </div>
    );
  }


  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="flex flex-col gap-6 pb-6 animate-in fade-in duration-300">

      {/* =================================================
          HEADER
      ================================================= */}

      <DashboardHeader
        userName={user?.name || "ASHA Worker"}
        roleTitle={
          config?.header?.roleTitle || "ASHA Worker"
        }
        subtitle={
          user?.village
            ? `Village: ${user.village}`
            : config?.header?.subtitle
        }
      />


      {/* =================================================
          STATS CARDS
          
          criticalAlerts is calculated from the actual
          alerts array so the card count matches the
          Critical Alerts section.
      ================================================= */}

      <StatsCards
        stats={{
          ...(stats || {}),
          criticalAlerts: criticalAlerts.length,
        }}
      />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">

        {/* =================================================
            TODAY'S SCHEDULE
        ================================================= */}

        <div className="xl:col-span-2">
          <TodaySchedule
            visits={todayVisits}
            loading={visitLoading}
          />
        </div>


        {/* =================================================
            RIGHT SIDE PANEL
        ================================================= */}

        <div className="flex flex-col gap-6">

          {/* Critical Alerts */}

          <CriticalAlerts
            alerts={alerts || []}
          />


          {/* Health Programs */}

          <HealthPrograms
            programs={healthPrograms || []}
          />

        </div>
      </div>


      {/* =================================================
          FOOTER ACTIONS
      ================================================= */}

      <div className="flex justify-end">
        <QuickActions />
      </div>

    </div>
  );
}