import Container from "./Container";
import StatCard from "./StatCard";
import { Users, HeartPulse, Pill, Activity } from "lucide-react";

export default function StatsRow() {
  const stats = [
    { value: "10,000+", label: "Beneficiaries", icon: Users, color: "text-blue-700", bg: "bg-blue-100" },
    { value: "5,000+", label: "Health Visits", icon: HeartPulse, color: "text-emerald-700", bg: "bg-emerald-100" },
    { value: "800+", label: "Medicines", icon: Pill, color: "text-purple-700", bg: "bg-purple-100" },
    { value: "24×7", label: "Monitoring", icon: Activity, color: "text-rose-700", bg: "bg-rose-100" },
  ];

  return (
    <section className="relative overflow-hidden py-16">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1584515933487-779824d29309?w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-white/90 backdrop-blur-sm"></div>
      
      <Container className="relative z-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} icon={stat.icon} color={stat.color} bg={stat.bg} />
          ))}
        </div>
      </Container>
    </section>
  );
}