import React from "react";
import { Search, Bell } from "lucide-react";

export default function Navbar({
  userName = "Dr. Rajesh Kumar",
  avatarUrl = "https://i.pravatar.cc/80?img=12",
  hasNotifications = true,
  onSearch = () => {},
}) {
  return (
    <header className="flex w-full items-center justify-between gap-4 border-b border-slate-200 bg-white px-8 py-4">
      {/* Search bar */}
      <div className="flex w-full max-w-xl items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search patients, reports..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-5">
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={22} />
          {hasNotifications && (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
          )}
        </button>

        <img
          src={avatarUrl}
          alt={userName}
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>
    </header>
  );
}