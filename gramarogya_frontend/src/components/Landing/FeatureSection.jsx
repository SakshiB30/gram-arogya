import Container from "./Container";
import { ClipboardCheck, Package, Shield, FileText } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      icon: ClipboardCheck,
      title: "Beneficiary Management",
      description: "Register and maintain beneficiary profiles with complete demographic details and health history."
    },
    {
      icon: Package,
      title: "Medicine Inventory",
      description: "Track medicine stock, issue medicines, and monitor stock history with automatic low-stock alerts."
    },
    {
      icon: Shield,
      title: "Verification Workflow",
      description: "ANMs verify beneficiary registrations and ASHA reports before they become official records."
    },
    {
      icon: FileText,
      title: "ASHA Reporting",
      description: "Register beneficiaries, submit visit reports, and record community health activities in real-time."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">Core Features</span>
          <h2 className="mt-5 text-3xl font-bold text-slate-900 md:text-4xl">
            Everything Your PHC Needs
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Simplify beneficiary management, field reporting, medicine inventory, and healthcare records.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-2xl bg-slate-50 p-6 shadow-sm border border-slate-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}