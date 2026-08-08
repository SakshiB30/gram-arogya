import Container from "./Container";
import { UserPlus, ClipboardCheck, HeartPulse, FileText } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Beneficiary Registration",
    description: "ASHA workers register beneficiaries digitally with complete health profiles.",
    color: "bg-blue-100 text-blue-700"
  },
  {
    icon: ClipboardCheck,
    title: "Health Visit",
    description: "Record home visits, maternal care, immunization and follow-up activities.",
    color: "bg-emerald-100 text-emerald-700"
  },
  {
    icon: HeartPulse,
    title: "PHC Verification",
    description: "ANMs verify reports and monitor beneficiary health status.",
    color: "bg-indigo-100 text-indigo-700"
  },
  {
    icon: FileText,
    title: "Reports & Analytics",
    description: "Generate reports and monitor medicine usage for informed decisions.",
    color: "bg-orange-100 text-orange-700"
  },
];

export default function WorkflowSection() {
  return (
    <section id="workflow" className="py-20 bg-slate-50">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">Workflow</span>
          <h2 className="mt-5 text-3xl font-bold text-slate-900 md:text-4xl">
            How GramArogya Works
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Streamlined digital workflow connecting ASHA Workers, ANMs and PHC Administrators.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 transition hover:-translate-y-2 hover:shadow-lg">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${step.color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                <div className="mt-4 text-4xl font-bold text-slate-100">0{index + 1}</div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}