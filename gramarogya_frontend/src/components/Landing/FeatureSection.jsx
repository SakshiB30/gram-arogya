import { Link } from "react-router-dom";
import Container from "./Container";
import FeatureCard from "./FeatureCard";
import MiniDashboardPreview from "./MiniDashboardPreview";

import {
  Users,
  ClipboardCheck,
  Package,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export default function FeatureSection() {
  return (
    <section id="features" className="bg-slate-50 py-20">
      <Container>
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Core Features
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            Everything Your PHC Needs in One Platform
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            GramArogya simplifies beneficiary management, field reporting,
            medicine inventory, and healthcare records through one secure
            digital platform.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">

          {/* Large Card */}
          <div className="lg:col-span-2">
            <FeatureCard
              icon={Users}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              title="Beneficiary Management"
            >
              Register and maintain beneficiary profiles with complete
              demographic details, family information, and health history.

              <ul className="mt-4 space-y-2">

                <li className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={16} />
                  Household Mapping
                </li>

                <li className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={16} />
                  Health Profile
                </li>

                <li className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={16} />
                  Pregnancy & Child Tracking
                </li>

              </ul>

              <MiniDashboardPreview />
            </FeatureCard>
          </div>

          {/* ASHA Reporting */}

          <FeatureCard
            icon={ClipboardCheck}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            title="ASHA Field Reporting"
          >
            ASHA workers can register beneficiaries, submit visit reports,
            record community health activities, and send them to the ANM
            for verification.

            <div className="mt-5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Verification Progress</span>
                <span>98%</span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-200">
                <div className="h-2 w-[98%] rounded-full bg-emerald-500"></div>
              </div>
            </div>
          </FeatureCard>

          {/* Inventory */}

          <FeatureCard
            icon={Package}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
            title="Medicine Inventory"
          >
            Track medicine stock, receive new inventory, issue medicines,
            and monitor stock history with automatic low-stock visibility.
          </FeatureCard>

          {/* Verification */}

          <FeatureCard
            icon={ShieldCheck}
            iconBg="bg-indigo-100"
            iconColor="text-indigo-600"
            title="Verification Workflow"
          >
            ANMs verify beneficiary registrations and ASHA reports before
            they become part of the official PHC records.
          </FeatureCard>

          {/* CTA */}

          <div className="flex flex-col justify-between rounded-2xl bg-blue-700 p-7 text-white shadow-lg">

            <div>
              <h3 className="text-xl font-bold">
                Start Managing Digitally
              </h3>

              <p className="mt-3 leading-7 text-blue-100">
                Improve healthcare delivery with digital beneficiary
                management, reporting, verification, and medicine
                inventory.
              </p>
            </div>

            <Link
              to="/register"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-slate-100"
            >
              Create Account

              <ChevronRight size={18} />
            </Link>

          </div>

        </div>
      </Container>
    </section>
  );
}