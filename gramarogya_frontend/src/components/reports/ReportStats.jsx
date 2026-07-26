import React from "react";
import { useSelector } from "react-redux";
import {
  Users,
  CalendarCheck,
  HeartPulse,
  Pill,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

export default function ReportStats({ summary }) {
  const { user } = useSelector((state) => state.auth);
 const cards = [
  {
    title: "Beneficiaries",
    value: summary?.totalBeneficiaries ?? 0,
    subtitle: "Registered",
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Visits",
    value: summary?.totalVisits ?? 0,
    subtitle: "Completed",
    icon: CalendarCheck,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Health Records",
    value: summary?.totalHealthRecords ?? 0,
    subtitle: "Available",
    icon: HeartPulse,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },

  ...(user?.role !== "ASHA"
    ? [
        {
          title: "Medicines",
          value: summary?.totalMedicines ?? 0,
          subtitle: "Inventory",
          icon: Pill,
          iconBg: "bg-indigo-100",
          iconColor: "text-indigo-600",
        },
        {
          title: "Low Stock",
          value: summary?.lowStockMedicines ?? 0,
          subtitle: "Need Restock",
          icon: AlertTriangle,
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
        },
        {
          title: "Out of Stock",
          value: summary?.outOfStockMedicines ?? 0,
          subtitle: "Unavailable",
          icon: AlertCircle,
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
        },
      ]
    : []),
];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {card.value}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {card.subtitle}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${card.iconBg}`}
              >
                <Icon
                  size={22}
                  className={card.iconColor}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}