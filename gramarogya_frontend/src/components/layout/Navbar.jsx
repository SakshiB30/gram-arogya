import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../../redux/slices/authSlice";
import { fetchProfile } from "../../redux/slices/profileSlice";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../redux/slices/notificationSlice";

import useNetworkStatus from "../../offline/useNetworkStatus";
import GlobalSearch from "../common/GlobalSearch";
import usePendingSyncCount from "../../offline/usePendingSyncCount";
import { syncPendingOperations } from "../../offline/syncService";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Network status
  const online = useNetworkStatus();
  const {
  pendingCount,
  syncing,
} = usePendingSyncCount();

  
  const { user } = useSelector((state) => state.auth);

  // const greeting = {
  //   ADMIN: "Administrator",
  //   ANM: "Auxiliary Nurse Midwife",
  //   ASHA: "ASHA Worker",
  // };

  const { notifications = [] } = useSelector(
    (state) => state.notification
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const [notifOpen, setNotifOpen] = useState(false);
  const [manualSyncing, setManualSyncing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchNotifications());

    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setNotifOpen(false);
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleManualSync = async () => {
  if (!online || pendingCount === 0 || manualSyncing) {
    return;
  }

  try {
    setManualSyncing(true);

    const result = await syncPendingOperations();

    console.log("Manual Sync Result:", result);
  } catch (error) {
    console.error("Manual sync failed:", error);
  } finally {
    setManualSyncing(false);
  }
};

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-6 py-3.5 backdrop-blur-md md:px-8">
      {/* Left Side */}
      <div className="flex items-center gap-6">
        {/* 
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Welcome, {user?.name}
          </h2>

          <p className="text-sm text-slate-500">
            {greeting[user?.role] || "Healthcare Staff"}
          </p>
        </div>
        */}

        <GlobalSearch />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">

{/* Network & Sync Status */}
<div className="flex items-center gap-2">

  <div
    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
      online
        ? "bg-green-50 text-green-700"
        : "bg-red-50 text-red-700"
    }`}
  >
    <span
      className={`h-2 w-2 rounded-full ${
        online
          ? "bg-green-500"
          : "bg-red-500"
      }`}
    />

    {!online ? (
      <>
        <span>Offline</span>

        {pendingCount > 0 && (
          <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
            {pendingCount} pending
          </span>
        )}
      </>
    ) : syncing || manualSyncing ? (
      <>
        <span>Syncing...</span>

        {pendingCount > 0 && (
          <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
            {pendingCount}
          </span>
        )}
      </>
    ) : (
      <span>Online</span>
    )}
  </div>

  {/* Manual Sync Button */}
  {online && pendingCount > 0 && !syncing && (
    <button
      onClick={handleManualSync}
      disabled={manualSyncing}
      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-600 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {manualSyncing ? "Syncing..." : "Sync Now"}
    </button>
  )}

</div>

        {/* Notification */}
        <div
          className="relative"
          ref={notifRef}
        >
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

              {/* Notification Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">
                  Notifications
                </p>

                {notifications.length > 0 && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();

                      await dispatch(
                        markAllNotificationsAsRead()
                      );

                      dispatch(fetchNotifications());
                    }}
                    className="text-xs font-medium text-violet-600 hover:underline"
                  >
                    Mark all
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-slate-400">
                    You're all caught up 🎉
                  </p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={async () => {
                        await dispatch(
                          markNotificationAsRead(n.id)
                        );

                        dispatch(fetchNotifications());
                      }}
                      className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                        !n.read
                          ? "bg-violet-50"
                          : ""
                      }`}
                    >
                      {/* Unread Indicator */}
                      {!n.read && (
                        <span className="mt-2 h-2 w-2 rounded-full bg-violet-600" />
                      )}

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">
                          {n.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {n.message}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {n.createdAt
                            ? new Date(
                                n.createdAt
                              ).toLocaleString()
                            : ""}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User Menu */}
        <div
          className="relative"
          ref={menuRef}
        >
          <button
            onClick={() =>
              setMenuOpen((prev) => !prev)
            }
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-slate-100"
          >
            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-lg font-bold text-white">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            {/* User Name + Role */}
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-medium text-slate-800">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-400">
                {user?.role || ""}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-slate-400 sm:block"
            />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-14 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

              {/* User Info */}
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">
                  {user?.name}
                </p>

                <p className="text-xs text-slate-500">
                  {user?.email}
                </p>

                <p className="mt-1 text-xs font-medium text-violet-600">
                  {user?.role}
                </p>
              </div>

              {/* Profile */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/app/profile");
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <User size={16} />
                My Profile
              </button>

              <div className="h-px bg-slate-100" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

