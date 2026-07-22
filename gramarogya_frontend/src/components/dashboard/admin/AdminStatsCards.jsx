import {
  Users,
  ClipboardList,
  CalendarCheck,
  CalendarClock,
  Baby,
  HeartPulse,
  UserRound,
  Activity,
} from "lucide-react";

export default function AdminStatsCards({ stats }) {
  const cards = [
  {
    title: "Total Beneficiaries",
    value: stats.totalBeneficiaries,
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Health Workers",
    value: stats.totalUsers,
    icon: UserRound,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "ANMs",
    value: stats.totalAnms,
    icon: Activity,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    title: "ASHAs",
    value: stats.totalAshas,
    icon: HeartPulse,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {card.value}
                </h2>
              </div>

              <div className={`${card.color} rounded-xl p-3`}>
                <Icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}