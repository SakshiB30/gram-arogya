import Container from "./Container";
import { Landmark, ShieldCheck, Globe2, Activity, BadgeCheck } from "lucide-react";

export default function TrustBar() {
  const items = [
    { icon: Landmark, title: "Government Healthcare" },
    { icon: ShieldCheck, title: "Secure & Reliable" },
    { icon: Globe2, title: "Digital India" },
    { icon: Activity, title: "Real-Time Monitoring" },
    { icon: BadgeCheck, title: "Trusted by PHCs" },
  ];

  return (
    <section className="relative overflow-hidden border-y border-slate-200 py-6">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-50/90 via-white/90 to-slate-50/90 backdrop-blur-sm"></div>
      
      <Container className="relative z-10">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map(({ icon: Icon, title }) => (
            <div key={title} className="flex items-center gap-3 rounded-xl bg-white/95 backdrop-blur-sm p-3 shadow-sm border border-slate-200/50">
              <div className="rounded-full bg-blue-100 p-2"><Icon className="h-5 w-5 text-blue-700" /></div>
              <span className="text-sm font-medium text-slate-700">{title}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}