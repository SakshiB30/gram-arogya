import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import GlobalSearch from "../common/GlobalSearch";

import { fetchProfile } from "../../redux/slices/profileSlice";


export default function Navbar({
  
  avatarUrl = "https://i.pravatar.cc/80?img=12",
  hasNotifications = true,
  notifications = [
    { id: 1, title: "New patient registered", time: "5m ago" },
    { id: 2, title: "Report ready for review", time: "1h ago" },
    { id: 3, title: "ASHA sync completed", time: "3h ago" },
  ],
  onSearch = () => {},
  
}) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

const { profile } = useSelector((state) => state.profile);

  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const menuRef = useRef(null);

    
    
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  dispatch(fetchProfile());
}, [dispatch]);

  const handleLogout = () => {
  setMenuOpen(false);

  dispatch(logout());

  navigate("/login", { replace: true });
};

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-6 py-3.5 backdrop-blur-md md:px-8">
      <GlobalSearch />

      {/* Right icons */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {hasNotifications && (
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">Notifications</p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-slate-400">
                    You're all caught up
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 border-b border-slate-50 px-4 py-3 last:border-0 hover:bg-slate-50"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                      <div>
                        <p className="text-sm text-slate-700">{n.title}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{n.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-slate-100"
          >
           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-lg font-bold text-white">
  {profile?.name?.charAt(0)?.toUpperCase() || "A"}
</div>
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-medium text-slate-800">{profile?.name}</p>
              <p className="text-xs text-slate-400">{profile?.role}</p>
            </div>
            <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
          </button>

          {menuOpen && (
  <div className="absolute right-0 top-14 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

    {/* User Info */}
    <div className="border-b border-slate-100 px-4 py-3">
      <p className="text-sm font-semibold text-slate-800">
        {profile?.name}
      </p>

      <p className="text-xs text-slate-500">
        {profile?.email}
      </p>

      <p className="mt-1 text-xs text-violet-600 font-medium">
        {profile?.role}
      </p>
    </div>

    {/* Profile */}
    <button
  onClick={() => {
    setMenuOpen(false);
    navigate("/app/profile");
  }}
  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
>
  <User size={16} />
  My Profile
</button>

    {/* Settings */}
<button
  onClick={() => {
    setMenuOpen(false);
    navigate("/app/settings");
  }}
  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-green-50"
>      <Settings size={16} />
      Settings
    </button>

    <div className="h-px bg-slate-100" />

    {/* Logout */}
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
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