import {
  UserPlus,
  ClipboardCheck,
  HeartPulse,
  FileText,
} from "lucide-react";
import Container from "./Container";

const steps = [
  {
    icon: UserPlus,
    title: "1. Beneficiary Registration",
    description:
      "ASHA workers register beneficiaries and maintain household information digitally.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: ClipboardCheck,
    title: "2. Health Visit",
    description:
      "Record home visits, maternal care, immunization and follow-up activities in real time.",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: HeartPulse,
    title: "3. PHC Verification",
    description:
      "ANMs verify reports, update treatment information and monitor beneficiary health status.",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    icon: FileText,
    title: "4. Reports & Analytics",
    description:
      "Generate reports, monitor medicine usage and make informed healthcare decisions.",
    color: "bg-orange-100 text-orange-700",
  },
];

export default function WorkflowSection() {
  return (
    <section
      id="workflow"
      className="bg-slate-50 py-20"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Workflow
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-900">
            How GramArogya Works
          </h2>

          <p className="mt-4 text-slate-600">
            A streamlined digital workflow connecting ASHA Workers,
            ANMs and PHC Administrators to ensure better healthcare
            delivery in rural communities.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl ${step.color}`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>

                <div className="absolute right-5 top-5 text-5xl font-bold text-slate-100">
                  0{index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}