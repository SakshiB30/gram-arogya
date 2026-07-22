import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { dashboardConfig } from "../config/dashboardConfig";

import DashboardHeader from "../DashboardHeader";
import StatsCards from "../StatsCards";
import QuickActions from "../QuickActions";
import RecentActivity from "../RecentActivity";
import CriticalAlerts from "../CriticalAlerts";

import UpcomingVisits from "./UpcomingVisits";
import LowStockMedicines from "./LowStockMedicines";

import {
  fetchDashboard,
} from "../../../redux/slices/dashboardSlice";

export default function AshaDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const config = dashboardConfig[user.role];

  const {
    stats,
    recentActivities,
    alerts,
    upcomingVisits,
    lowStockMedicines,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-100 p-5 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
  userName={user?.name || stats?.userName}
  roleTitle={config.header.roleTitle}
  subtitle={config.header.subtitle}
/>

      <StatsCards stats={stats} />

      <QuickActions />

      <div className="grid gap-6 xl:grid-cols-2">

    <UpcomingVisits
        visits={upcomingVisits}
    />

    <LowStockMedicines
        medicines={lowStockMedicines}
    />

</div>

<div className="grid gap-6 xl:grid-cols-2">

    <RecentActivity
        activities={recentActivities}
    />

    <CriticalAlerts
        alerts={alerts}
    />

</div>
    </div>
  );
}