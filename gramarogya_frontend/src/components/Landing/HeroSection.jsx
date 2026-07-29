import { Link } from "react-router-dom";
import Container from "./Container";
import {
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  Activity,
  Users,
  HeartPulse,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-blue-50 via-white to-white py-20">
      <Container className="grid items-center gap-16 lg:grid-cols-2">
        {/* Left Section */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <ShieldCheck className="h-4 w-4" />
            Government Rural Healthcare Initiative
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 lg:text-6xl">
            Smart Healthcare
            <br />
            <span className="text-blue-700">
              for Every Village
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            GramArogya is a secure digital healthcare platform that enables
            Primary Health Centers to manage beneficiaries, health records,
            medicine inventory, field visits, and ASHA reporting from one
            centralized system.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-7 py-3 font-semibold text-white shadow hover:bg-blue-800 transition"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <PlayCircle className="h-5 w-5" />
              Staff Login
            </Link>
          </div>

          {/* Highlights */}

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-xl bg-white p-4 shadow-sm border">
              <ShieldCheck className="mb-2 h-8 w-8 text-emerald-600" />
              <h4 className="font-semibold text-slate-900">
                Secure Access
              </h4>
              <p className="mt-1 text-sm text-slate-500">
                Role-based authentication for Admin, ANM & ASHA.
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm border">
              <HeartPulse className="mb-2 h-8 w-8 text-red-500" />
              <h4 className="font-semibold text-slate-900">
                Patient Care
              </h4>
              <p className="mt-1 text-sm text-slate-500">
                Digital beneficiary and health record management.
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm border">
              <Activity className="mb-2 h-8 w-8 text-blue-600" />
              <h4 className="font-semibold text-slate-900">
                Real-Time Reports
              </h4>
              <p className="mt-1 text-sm text-slate-500">
                Track visits, medicine stock and daily activities.
              </p>
            </div>

          </div>
        </div>

        {/* Right Section */}

        <div className="relative">

          <div className="overflow-hidden rounded-3xl border bg-gradient-to-br from-blue-100 via-white to-emerald-100 p-10 shadow-2xl">

            <div className="flex flex-col items-center">

              <div className="rounded-full bg-blue-100 p-6">
                <Users className="h-20 w-20 text-blue-600" />
              </div>

              <h2 className="mt-6 text-3xl font-bold text-slate-900">
                GramArogya
              </h2>

              <p className="mt-3 text-center text-slate-600">
                A Digital Healthcare Management Platform
                <br />
                connecting PHC, ANM and ASHA Workers.
              </p>

              <div className="mt-8 grid w-full grid-cols-2 gap-4">

                <div className="rounded-xl bg-white p-4 shadow">
                  <p className="text-3xl font-bold text-blue-700">100%</p>
                  <p className="text-sm text-slate-500">
                    Digital Records
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow">
                  <p className="text-3xl font-bold text-emerald-600">
                    24×7
                  </p>
                  <p className="text-sm text-slate-500">
                    Secure Access
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow">
                  <p className="text-3xl font-bold text-indigo-600">
                    ASHA
                  </p>
                  <p className="text-sm text-slate-500">
                    Daily Reporting
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow">
                  <p className="text-3xl font-bold text-red-500">
                    PHC
                  </p>
                  <p className="text-sm text-slate-500">
                    Smart Monitoring
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Floating Card */}

          <div className="absolute -bottom-8 left-8 rounded-2xl bg-white px-6 py-4 shadow-xl ring-1 ring-slate-200">

            <div className="flex items-center gap-4">

              <div className="rounded-full bg-emerald-100 p-3">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Daily Operations
                </p>

                <p className="font-semibold text-slate-900">
                  Beneficiaries • Visits • Inventory • Reports
                </p>
              </div>

            </div>

          </div>

        </div>
      </Container>
    </section>
  );
};

export default HeroSection;