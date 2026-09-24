import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Users,
  ClipboardList,
  HeartPulse,
  RefreshCw,
  WifiOff,
  LogOut,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";


import { useEffect } from "react";
import { startAutoSync } from "../offline/autoSyncService";

import usePendingSyncCount from "../offline/usePendingSyncCount";

export default function AshaOfflineLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { pendingCount } =
    usePendingSyncCount(user?.id);

    useEffect(() => {
  const stopAutoSync =
    startAutoSync(dispatch);

  return stopAutoSync;
}, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const navItems = [
    {
      label: "My Beneficiaries",
      icon: Users,
      path: "/app/offline/beneficiaries",
    },
    {
      label: "Field Visits",
      icon: ClipboardList,
      path: "/app/offline/visits",
    },
    {
      label: "Health Records",
      icon: HeartPulse,
      path: "/app/offline/health-records",
    },
    {
      label: "Pending Sync",
      icon: RefreshCw,
      path: "/app/offline/pending-sync",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              ASHA
            </h1>

            <p className="text-sm text-gray-500">
              ASHA Offline Workspace
            </p>
          </div>

          <div className="flex items-center gap-4">

            {/* Offline Status */}
            <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              <WifiOff size={16} />
              Offline
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-gray-100"
            >
              <LogOut size={17} />
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl p-6">

        {/* Offline Information */}
        <div className="mb-6 rounded-xl border bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Offline Field Work
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            You are offline. You can continue recording
            beneficiary visits and health information.
            Your changes will be synchronized when
            internet connectivity returns.
          </p>

          {pendingCount > 0 && (
            <div className="mt-3 text-sm font-medium text-orange-600">
              {pendingCount} pending operation
              {pendingCount !== 1 ? "s" : ""} waiting
              for synchronization.
            </div>
          )}
        </div>

        {/* Offline Navigation */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {navItems.map(
            ({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 rounded-xl p-4 transition ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md"
                      : "bg-white text-slate-700 shadow-sm hover:shadow"
                  }`
                }
              >
                <Icon size={22} />

                <span className="font-medium">
                  {label}
                </span>

                {label === "Pending Sync" &&
                  pendingCount > 0 && (
                    <span
                      className={`ml-auto rounded-full px-2 py-1 text-xs font-semibold ${
                        "bg-red-100 text-red-700"
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
              </NavLink>
            )
          )}

        </div>

        {/* Child Offline Page */}
        <Outlet />

      </main>
    </div>
  );
}