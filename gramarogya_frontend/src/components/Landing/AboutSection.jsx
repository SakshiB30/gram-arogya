import Container from "./Container";
import {
  HeartHandshake,
  Target,
  Eye,
  ShieldCheck,
} from "lucide-react";

export default function AboutSection() {
  const cards = [
    {
      icon: HeartHandshake,
      title: "Our Mission",
      description:
        "To strengthen rural healthcare by providing a digital platform that enables efficient beneficiary management, health monitoring, and collaboration between ASHA workers, ANMs, and PHC administrators.",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "To build a connected and transparent healthcare ecosystem where every beneficiary receives timely and quality healthcare services through digital transformation.",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: Target,
      title: "Our Goal",
      description:
        "Improve healthcare delivery, reduce paperwork, simplify reporting, and empower frontline healthcare workers with real-time information.",
      color: "bg-indigo-100 text-indigo-700",
    },
  ];

  return (
    <section
      id="about"
      className="py-20 bg-white"
    >
      <Container>

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            About GramArogya
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-900">
            Digital Healthcare for Every Village
          </h2>

          <p className="mt-5 text-slate-600 leading-8">
            GramArogya is a comprehensive Primary Healthcare Management
            System designed to simplify healthcare operations at Primary
            Health Centers. It connects ASHA workers, ANMs, Medical
            Officers, and PHC Administrators through one secure digital
            platform.
          </p>

        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">

          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {card.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {card.description}
                </p>
              </div>
            );
          })}

        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 p-10 text-white">

          <div className="flex flex-col items-center text-center">

            <ShieldCheck className="h-14 w-14 text-white" />

            <h3 className="mt-5 text-2xl font-bold">
              Secure • Reliable • Government Ready
            </h3>

            <p className="mt-4 max-w-3xl text-blue-100 leading-8">
              GramArogya follows a secure role-based access model where
              Administrators, ANMs, and ASHA workers can securely manage
              healthcare data, beneficiary records, medicine inventory,
              health visits, and reports while ensuring privacy,
              accountability, and efficient service delivery.
            </p>

          </div>

        </div>

      </Container>
    </section>
  );
}