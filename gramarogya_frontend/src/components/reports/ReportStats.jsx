import React from "react";
import {
  FileText,
  Users,
  Activity,
  CalendarCheck,
} from "lucide-react";

export default function ReportStats({ reports = [] }) {
  const totalReports = reports.length;

  const totalBeneficiaries = new Set(
    reports.map((report) => report.beneficiaryId)
  ).size;

  const totalVisits = reports.reduce(
    (sum, report) => sum + (report.totalVisits || 0),
    0
  );

  const recentReports = reports.filter((report) => {
    if (!report.createdAt) return false;

    const createdDate = new Date(report.createdAt);
    const today = new Date();

    const diff =
      (today - createdDate) /
      (1000 * 60 * 60 * 24);

    return diff <= 30;
  }).length;


  const cards = [
    {
      title: "Total Reports",
      value: totalReports,
      icon: FileText,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Beneficiaries Covered",
      value: totalBeneficiaries,
      icon: Users,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Total Visits",
      value: totalVisits,
      icon: Activity,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Recent Reports",
      value: recentReports,
      icon: CalendarCheck,
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
  ];


  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >

            <div className="flex items-center justify-between">

              <p className="text-sm font-semibold text-slate-500">
                {card.title}
              </p>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${card.bg}`}
              >
                <Icon
                  size={20}
                  className={card.color}
                />
              </div>

            </div>


            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              {card.value}
            </h2>

          </div>
        );
      })}

    </div>
  );
}