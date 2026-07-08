import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";

import { fetchDashboard } from "../redux/slices/dashboardSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    stats,
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
        doctorName="ASHA Worker"
        onNewReport={() => navigate("/app/visits/add")}
      />

      <StatsCards stats={stats} />

      <QuickActions />

    </div>
  );
}