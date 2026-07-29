import Container from "./Container";
import {
  Landmark,
  ShieldCheck,
  Globe2,
  Activity,
  BadgeCheck,
} from "lucide-react";

export default function TrustBar() {
  const items = [
    {
      icon: Landmark,
      title: "Government Healthcare",
      subtitle: "PHC Digital Services",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Reliable",
      subtitle: "Role-Based Access",
    },
    {
      icon: Globe2,
      title: "Digital India",
      subtitle: "Modern Healthcare Platform",
    },
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      subtitle: "Beneficiaries & Visits",
    },
    {
      icon: BadgeCheck,
      title: "Trusted by PHCs",
      subtitle: "Healthcare Professionals",
    },
  ];

  return (
    <section className="border-y border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 py-8">
      <Container>

        {/* Heading */}
        <div className="mb-8 text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Trusted Platform
          </span>

          <h2 className="mt-4 text-2xl font-bold text-slate-900">
            Built for India's Primary Healthcare System
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Empowering PHCs, ANMs, ASHA workers and Administrators through
            secure digital healthcare management.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {items.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Icon className="h-6 w-6 text-blue-700" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                {title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {subtitle}
              </p>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
}