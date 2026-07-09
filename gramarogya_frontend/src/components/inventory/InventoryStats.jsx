import React from "react";
import { Archive, AlertTriangle, AlertCircle } from "lucide-react";

export default function InventoryStats({ medicines = [] }) {
  const totalMedicines = medicines.length;

  const lowStock = medicines.filter(
    (medicine) => medicine.status === "Low Stock"
  ).length;

  const outOfStock = medicines.filter(
    (medicine) => medicine.status === "Out of Stock"
  ).length;

  const cards = [
    {
      title: "Total Medicines",
      value: totalMedicines,
      subtitle: "Items",
      icon: Archive,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Low Stock",
      value: lowStock,
      subtitle: "Items",
      icon: AlertTriangle,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      subtitle: "Items",
      icon: AlertCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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

              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full ${card.iconBg}`}
              >
                <Icon size={18} className={card.iconColor} />
              </span>
            </div>

            <div className="mt-4">
              <h2 className="text-4xl font-bold text-slate-900">
                {card.value}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}