
import React from "react";

// =====================================================
// PROGRESS BAR
// =====================================================

function ProgressBar({ label, percent = 0 }) {

  const safePercent = Math.min(
    100,
    Math.max(0, Number(percent) || 0)
  );

  return (
    <div>

      {/* Label + Percentage */}
      <div className="flex items-center justify-between text-sm">

        <span className="font-medium text-slate-700">
          {label}
        </span>

        <span className="font-semibold text-slate-900">
          {safePercent}%
        </span>

      </div>


      {/* Progress Bar */}
      <div className="mt-2 h-2 w-full rounded-full bg-slate-100">

        <div
          className="h-2 rounded-full bg-blue-600 transition-all duration-500"
          style={{
            width: `${safePercent}%`,
          }}
        />

      </div>

    </div>
  );
}


// =====================================================
// HEALTH PROGRAMS
// =====================================================

export default function HealthPrograms({
  programs = [],
}) {

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* Header */}
      <h2 className="mb-4 text-lg font-bold text-slate-900">
        Health Programs
      </h2>


      {/* No Data */}
      {!programs || programs.length === 0 ? (

        <p className="text-sm text-slate-500">
          No program data available.
        </p>

      ) : (

        /* Program List */
        <div className="space-y-4">

          {programs.map((program) => (

            <ProgressBar
              key={program.key}
              label={program.label}
              percent={program.percent}
            />

          ))}

        </div>

      )}

    </div>
  );
}

