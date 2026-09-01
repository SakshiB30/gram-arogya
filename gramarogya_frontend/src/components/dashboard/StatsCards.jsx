import { Users, Calendar, ClipboardList, AlertTriangle } from "lucide-react";
import StatCard from "./StatCard";

// Maps redux `stats` object -> the 4 cards from the screenshot.
// Expects stats = { totalBeneficiaries, todaysVisits, pendingVisits, criticalAlerts }
const StatsCards = ({ stats }) => {
  const cards = [
    {
      key: "totalBeneficiaries",
      title: "Total Beneficiaries",
      icon: Users,
    },
    {
      key: "todayVisits",
      title: "Today's Visits",
      icon: Calendar,
    },
    {
      key: "pendingVisits",
      title: "Pending Visits",
      icon: ClipboardList,
      highlight: "amber",
    },
    {
      key: "criticalAlerts",
      title: "Critical Alerts",
      icon: AlertTriangle,
      highlight: "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.key}
          title={card.title}
          value={stats?.[card.key] ?? 0}
          icon={card.icon}
          highlight={card.highlight}
        />
      ))}
    </div>
  );
};

export default StatsCards;