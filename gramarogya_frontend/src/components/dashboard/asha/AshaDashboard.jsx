import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useNetworkStatus from "../../../offline/useNetworkStatus";
import usePendingSyncCount from "../../../offline/usePendingSyncCount";
import useSyncQueue from "../../../offline/useSyncQueue";

import {
  AlertTriangle,
  LayoutGrid,
  Zap,
  CalendarCheck,
  HeartPulse,
} from "lucide-react";

import { dashboardConfig } from "../config/dashboardConfig";
import DashboardHeader from "../DashboardHeader";
import StatsCards from "../StatsCards";
import QuickActions from "../QuickActions";
import CriticalAlerts from "../CriticalAlerts";
import HealthPrograms from "../HealthPrograms";
import TodaySchedule from "../../visit/TodaySchedule";

import { fetchDashboard } from "../../../redux/slices/dashboardSlice";
import { fetchTodayVisits } from "../../../redux/slices/visitSlice";
import { getErrorMessage } from "../../../utils/apiError";

// =====================================================
// PRESENTATIONAL COMPONENTS
// =====================================================

const SectionHeader = ({
  icon: Icon,
  label,
  accent = "slate",
  count,
}) => {
  const accentClasses = {
    slate: "bg-slate-100 text-slate-500",
    amber: "bg-amber-100 text-amber-600",
    sky: "bg-sky-100 text-sky-600",
    rose: "bg-rose-100 text-rose-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };

  return (
    <div className="mb-2 flex items-center gap-2">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-md ${accentClasses[accent]}`}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </h2>

      {typeof count === "number" && count > 0 && (
        <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
          {count}
        </span>
      )}
    </div>
  );
};

const SectionCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${className}`}
  >
    {children}
  </div>
);

const LoadingState = () => (
  <div
    className="flex min-h-75 flex-col items-center justify-center gap-3"
    role="status"
    aria-live="polite"
  >
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

    <p className="text-sm text-slate-500 animate-pulse">
      Loading your dashboard…
    </p>
  </div>
);

const ErrorState = ({ message }) => (
  <div
    className="flex items-start gap-4 rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-orange-50 p-5 shadow-sm ring-1 ring-red-100/50"
    role="alert"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
      <AlertTriangle className="h-5 w-5 text-red-600" />
    </div>

    <div className="flex-1">
      <p className="font-semibold text-red-800">
        Request Failed
      </p>

      <p className="mt-0.5 text-sm text-red-600/90">
        {message}
      </p>
    </div>
  </div>
);

const CriticalAlertsSection = ({ alerts }) => (
  <div
    className="animate-in fade-in slide-in-from-top-2 duration-500 delay-75"
    role="alert"
    aria-live="assertive"
  >
    <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />

          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
        </span>

        <h2 className="text-sm font-semibold uppercase tracking-wide text-red-700">
          Critical Alerts · {alerts.length}
        </h2>
      </div>

      <CriticalAlerts alerts={alerts} />
    </div>
  </div>
);

// =====================================================
// OFFLINE / SYNC STATUS
// =====================================================

const OfflineSyncStatus = () => {
  const online = useNetworkStatus();

  const {
    pendingCount,
    syncing,
  } = usePendingSyncCount();

  let title = "All data is synced";
  let message = "Your offline data is up to date.";
  let statusClass =
    "bg-emerald-50 border-emerald-200 text-emerald-700";

  if (!online) {
    title = "Offline Mode";

    message =
      "Your changes are saved locally and will sync when internet returns.";

    statusClass =
      "bg-red-50 border-red-200 text-red-700";
  } else if (syncing) {
    title = "Syncing your data...";

    message =
      "Please wait while your offline changes are uploaded.";

    statusClass =
      "bg-blue-50 border-blue-200 text-blue-700";
  } else if (pendingCount > 0) {
    title = `${pendingCount} record${
      pendingCount > 1 ? "s" : ""
    } waiting to sync`;

    message =
      "Your changes will sync automatically when possible.";

    statusClass =
      "bg-amber-50 border-amber-200 text-amber-700";
  }

  return (
    <div
      className={`rounded-2xl border p-4 ${statusClass}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold">
            {title}
          </p>

          <p className="mt-1 text-sm opacity-80">
            {message}
          </p>
        </div>

        {!online && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium">
            Offline
          </span>
        )}

        {online && syncing && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium">
            Syncing
          </span>
        )}
      </div>
    </div>
  );
};

// =====================================================
// PENDING SYNC LIST
// =====================================================

const PendingSyncList = ({ operations }) => {
  const pendingOperations = operations.filter(
    (operation) =>
      operation.status === "PENDING" ||
      operation.status === "SYNCING" ||
      operation.status === "FAILED"
  );

  // Don't show the section when everything is synced
  if (pendingOperations.length === 0) {
    return null;
  }

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Pending Sync";

      case "SYNCING":
        return "Syncing...";

      case "FAILED":
        return "Sync Failed";

      default:
        return status;
    }
  };

  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Pending Offline Changes
        </h2>

        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
          {pendingOperations.length}
        </span>
      </div>

      <div className="space-y-2">
        {pendingOperations
          .slice(0, 5)
          .map((operation) => (
            <div
              key={operation.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {operation.entityType ===
                  "HEALTH_RECORD"
                    ? "Health Record"
                    : "Visit"}
                </p>

                <p className="text-xs text-slate-500">
                  {operation.operation}
                </p>
              </div>

              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  operation.status === "FAILED"
                    ? "bg-red-100 text-red-700"
                    : operation.status === "SYNCING"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {getStatusText(
                  operation.status
                )}
              </span>
            </div>
          ))}
      </div>
    </SectionCard>
  );
};

// =====================================================
// CUSTOM HOOKS
// =====================================================

const useDashboardData = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  const {
    stats,
    alerts = [],
    healthPrograms = [],
    loading: dashboardLoading,
    error: dashboardError,
  } = useSelector(
    (state) => state.dashboard
  );

  const {
    todayVisits = [],
    loading: visitLoading,
    error: visitError,
  } = useSelector(
    (state) => state.visit
  );

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTodayVisits());
  }, [dispatch]);

  const criticalAlerts = alerts.filter(
    (alert) =>
      alert?.priority?.toUpperCase() === "HIGH"
  );

  const error =
    dashboardError || visitError;

  const isLoading =
    dashboardLoading || visitLoading;

  return {
    user,
    stats,
    criticalAlerts,
    healthPrograms,
    todayVisits,
    isLoading,
    error,
  };
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function AshaDashboard() {
  

  const {
    user,
    stats,
    criticalAlerts,
    healthPrograms,
    todayVisits,
    isLoading,
    error,
  } = useDashboardData();

  const syncOperations = useSyncQueue(user?.id);

  const config =
    dashboardConfig?.[user?.role];

  // ===================================================
  // LOADING STATE
  // ===================================================

  if (isLoading) {
    return <LoadingState />;
  }

  // ===================================================
  // ERROR STATE
  // ===================================================

  if (error) {
    const message = getErrorMessage(
      error,
      "Failed to load dashboard."
    );

    return (
      <ErrorState message={message} />
    );
  }

  // ===================================================
  // DASHBOARD
  // ===================================================

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top-2 duration-500">
        <DashboardHeader
          userName={
            user?.name || "ASHA Worker"
          }
          roleTitle={
            config?.header?.roleTitle ||
            "ASHA Worker"
          }
          subtitle={
            user?.village
              ? `Village: ${user.village}`
              : config?.header?.subtitle
          }
        />
      </div>

      {/* Offline / Sync Status */}
      <div className="animate-in fade-in slide-in-from-top-2 duration-500">
        <OfflineSyncStatus />
      </div>

      {/* Pending Offline Changes */}
      <div className="animate-in fade-in slide-in-from-top-2 duration-500">
        <PendingSyncList
          operations={syncOperations}
        />
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <CriticalAlertsSection
          alerts={criticalAlerts}
        />
      )}

      {/* Stats Overview */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
        <SectionHeader
          icon={LayoutGrid}
          label="Overview"
          accent="sky"
        />

        <div className="transition-transform duration-300 hover:scale-[1.003]">
          <StatsCards
            stats={{
              ...(stats || {}),
              criticalAlerts:
                criticalAlerts.length,
            }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
        <SectionHeader
          icon={Zap}
          label="Quick Actions"
          accent="amber"
        />

        <SectionCard className="px-5 py-3">
          <QuickActions className="grid grid-cols-3 gap-3" />
        </SectionCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Today's Schedule */}
        <div className="xl:col-span-2">
          <div className="animate-in fade-in slide-in-from-left-2 duration-500 delay-200">
            <SectionHeader
              icon={CalendarCheck}
              label="Today's Schedule"
              accent="emerald"
              count={todayVisits.length}
            />

            <SectionCard className="h-full">
              <TodaySchedule
                visits={todayVisits}
                loading={false}
              />
            </SectionCard>
          </div>
        </div>

        {/* Health Programs */}
        <div className="xl:col-span-1">
          <div className="animate-in fade-in slide-in-from-right-2 duration-500 delay-200">
            <SectionHeader
              icon={HeartPulse}
              label="Health Programs"
              accent="rose"
              count={healthPrograms.length}
            />

            <SectionCard className="h-full">
              <HealthPrograms
                programs={healthPrograms}
              />
            </SectionCard>
          </div>
        </div>

      </div>
    </div>
  );
}


