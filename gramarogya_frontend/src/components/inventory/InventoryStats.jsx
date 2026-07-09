import React from "react";
import {
  Archive,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

export default function InventoryStats({ medicines = [] }) {

  const totalMedicines = medicines.length;

  const lowStock = medicines.filter(
    (medicine) =>
      medicine.stock > 0 && medicine.stock < 50
  ).length;

  const outOfStock = medicines.filter(
    (medicine) => medicine.stock === 0
  ).length;

  const totalStock = medicines.reduce(
    (sum, medicine) => sum + (medicine.stock || 0),
    0
  );

  const cards = [
    {
      title: "Total Medicines",
      value: totalMedicines,
      subtitle: "Medicines",
      icon: Archive,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Low Stock",
      value: lowStock,
      subtitle: "Below 50 Units",
      icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      subtitle: "Requires Restocking",
      icon: AlertCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Total Units",
      value: totalStock,
      subtitle: "Available Stock",
      icon: Archive,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {card.value}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {card.subtitle}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}
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