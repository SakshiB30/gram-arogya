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

import StatCard from "./StatCard";

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Beneficiaries",
      value: stats?.totalBeneficiaries ?? 0,
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      footer: "Registered",
      footerColor: "text-slate-500",
    },
    {
      title: "Total Visits",
      value: stats?.totalVisits ?? 0,
      icon: ClipboardList,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      footer: "Completed",
      footerColor: "text-slate-500",
    },
    {
      title: "Today's Visits",
      value: stats?.todayVisits ?? 0,
      icon: CalendarCheck,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      footer: "Today",
      footerColor: "text-slate-500",
    },
    {
      title: "Upcoming Visits",
      value: stats?.upcomingVisits ?? 0,
      icon: CalendarClock,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      footer: "Scheduled",
      footerColor: "text-slate-500",
    },
    {
      title: "Pregnant Women",
      value: stats?.pregnantWomen ?? 0,
      icon: HeartPulse,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      footer: "Beneficiaries",
      footerColor: "text-slate-500",
    },
    {
      title: "Children",
      value: stats?.children ?? 0,
      icon: Baby,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      footer: "Under Care",
      footerColor: "text-slate-500",
    },
    {
      title: "TB Patients",
      value: stats?.tbPatients ?? 0,
      icon: Activity,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      footer: "Monitoring",
      footerColor: "text-slate-500",
    },
    {
      title: "Elderly",
      value: stats?.elderly ?? 0,
      icon: UserRound,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      footer: "Senior Citizens",
      footerColor: "text-slate-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconBg={card.iconBg}
          iconColor={card.iconColor}
          footer={card.footer}
          footerColor={card.footerColor}
        />
      ))}
    </div>
  );
};

export default StatsCards;