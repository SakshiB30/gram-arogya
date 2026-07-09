import React from "react";
import { Search, Filter } from "lucide-react";

export default function InventoryFilter({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) {
  const clearFilters = () => {
    onSearchChange("");
    onStatusChange("All");
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">

      {/* Search */}
      <div className="relative w-full lg:max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search medicine..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-500" />

          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Clear
        </button>

      </div>
    </div>
  );
}