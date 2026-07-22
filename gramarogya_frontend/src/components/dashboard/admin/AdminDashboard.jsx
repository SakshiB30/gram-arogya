import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchDashboard } from "../../../redux/slices/dashboardSlice";

import DashboardHeader from "../DashboardHeader";
import { dashboardConfig } from "../config/dashboardConfig";

import AdminStatsCards from "./AdminStatsCards";
import AdminRecentActivities from "./AdminRecentActivities";
import AdminAlerts from "./AdminAlerts";
import PendingVerifications from "./PendingVerifications";

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const config = dashboardConfig[user.role];

const {
  stats,
  recentActivities,
  alerts,
  pendingVerifications,
  loading,
  error,
} = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
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

      {/* Header */}

      <DashboardHeader
  userName={user?.name || stats?.userName}
  roleTitle={config.header.roleTitle}
  subtitle={config.header.subtitle}
/>

      {/* Stats */}

      <AdminStatsCards stats={stats} />

      {/* Activities + Alerts */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <AdminRecentActivities
          activities={recentActivities}
        />

        <AdminAlerts
          alerts={alerts}
        />

      </div>

      {/* Pending Verifications */}

      <PendingVerifications
        verifications={pendingVerifications}
      />

    </div>
  );
}