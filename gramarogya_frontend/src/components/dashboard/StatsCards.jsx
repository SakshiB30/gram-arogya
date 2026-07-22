import { useSelector } from "react-redux";
import StatCard from "./StatCard";
import { dashboardConfig } from "./config/dashboardConfig";

const StatsCards = ({ stats }) => {
  const { user } = useSelector((state) => state.auth);

  const cards = dashboardConfig[user.role]?.stats || [];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.key}
          title={card.title}
          value={stats?.[card.key] ?? 0}
          icon={card.icon}
          iconBg={card.iconBg}
          iconColor={card.iconColor}
          footer={card.footer}
          footerIcon={card.footerIcon}
          footerColor={card.footerColor}
        />
      ))}
    </div>
  );
};

export default StatsCards;