import Container from "./Container";
import { ClipboardCheck, Package, Shield, FileText } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      icon: ClipboardCheck,
      title: "Assigned Beneficiary Access",
      description:
        "ASHA workers can securely access beneficiaries assigned to them for field-level healthcare activities.",
    },
    {
      icon: Package,
      title: "Offline Visit Management",
      description:
        "Create, update, and manage beneficiary visits even when internet connectivity is unavailable.",
    },
    {
      icon: Shield,
      title: "Offline Health Records",
      description:
        "Record vital health information, diagnosis, prescription, and notes during field visits without internet.",
    },
    {
      icon: FileText,
      title: "Automatic Synchronization",
      description:
        "Pending offline changes are synchronized with the central system when internet connectivity is restored.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4">
            Core Features
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Essential Tools for ASHA Fieldwork
          </h2>

          <p className="text-lg text-slate-600">
            Manage assigned beneficiaries, visits, and health records offline,
            with secure synchronization when connectivity is restored.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                <feature.icon className="w-7 h-7 text-blue-600" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}