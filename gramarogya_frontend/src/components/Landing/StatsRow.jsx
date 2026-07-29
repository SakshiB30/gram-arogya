import Container from "./Container";
import StatCard from "./StatCard";

import {
  Users,
  HeartPulse,
  Pill,
  Activity,
} from "lucide-react";

export default function StatsRow() {
  const stats = [
    {
      value: "10,000+",
      label: "Beneficiaries Registered",
      icon: Users,
      color: "text-blue-700",
      bg: "bg-blue-100",
    },
    {
      value: "5,000+",
      label: "Health Visits Completed",
      icon: HeartPulse,
      color: "text-emerald-700",
      bg: "bg-emerald-100",
    },
    {
      value: "800+",
      label: "Medicines in Inventory",
      icon: Pill,
      color: "text-purple-700",
      bg: "bg-purple-100",
    },
    {
      value: "24×7",
      label: "Real-Time Health Monitoring",
      icon: Activity,
      color: "text-rose-700",
      bg: "bg-rose-100",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <Container>
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Platform Highlights
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-900 md:text-4xl">
            Transforming Rural Healthcare Digitally
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            GramArogya enables Primary Health Centers to efficiently manage
            beneficiaries, medicine inventory, health records, and field
            reporting through one secure digital platform.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              color={stat.color}
              bg={stat.bg}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}