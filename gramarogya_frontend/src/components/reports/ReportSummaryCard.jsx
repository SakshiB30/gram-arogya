import React from "react";

export default function ReportSummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <p className="text-sm font-semibold text-slate-500">
          {title}
        </p>

        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}
        >
          <Icon
            size={18}
            className={iconColor}
          />
        </span>

      </div>


      <div className="mt-4">

        <h2 className="text-4xl font-bold text-slate-900">
          {value}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>

      </div>

    </div>
  );
}