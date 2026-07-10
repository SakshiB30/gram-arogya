import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import CriticalAlerts from "../components/dashboard/CriticalAlerts";

import {
  fetchDashboard,
  fetchRecentActivities,
  fetchAlerts,
} from "../redux/slices/dashboardSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    stats,
    recentActivities,
    alerts,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchRecentActivities());
    dispatch(fetchAlerts());
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
        doctorName="ASHA Worker"
        onNewReport={() => navigate("/app/beneficiaries/add")}
      />

      <StatsCards stats={stats} />

      <QuickActions />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

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