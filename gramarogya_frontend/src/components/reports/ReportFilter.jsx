import React from "react";
import { Filter, Search } from "lucide-react";

export default function ReportFilter({
  searchTerm,
  typeFilter,
  statusFilter,
  onSearchChange,
  onTypeChange,
  onStatusChange,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">

      {/* Search */}
      <div className="relative w-full md:max-w-sm">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search report..."
          value={searchTerm}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 outline-none focus:border-blue-500"
        />

      </div>


      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">

        {/* Type Filter */}
        <div className="flex items-center gap-2">

          <Filter
            size={18}
            className="text-slate-500"
          />

          <select
            value={typeFilter}
            onChange={(e) =>
              onTypeChange(e.target.value)
            }
            className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          >

            <option value="All">
              All Types
            </option>

            <option value="Beneficiary">
              Beneficiary
            </option>

            <option value="Health">
              Health
            </option>

            <option value="Inventory">
              Inventory
            </option>

          </select>

        </div>


        {/* Status Filter */}
        {statusFilter !== undefined && (
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusChange(e.target.value)
            }
            className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          >

            <option value="All">
              All Status
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Pending">
              Pending
            </option>

          </select>
        )}

      </div>

    </div>
  );
}