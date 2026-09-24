import Container from "./Container";
import { Target, HeartHandshake, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-slate-50">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            About ASHA
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-900 md:text-4xl">
            Healthcare That Works Beyond Connectivity
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            ASHA is an offline-first digital healthcare platform designed
            to support ASHA workers in rural areas. It enables them to access
            assigned beneficiaries, manage visits, and record health information
            even without internet connectivity.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Target className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              Offline-First
            </h3>

            <p className="mt-3 text-slate-600">
              Continue essential field activities and access required
              healthcare information even when internet connectivity is
              unavailable.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Users className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              ASHA-Centered
            </h3>

            <p className="mt-3 text-slate-600">
              Provide ASHA workers with easy access to assigned beneficiaries,
              visits, and digital health records during fieldwork.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <HeartHandshake className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              Seamless Synchronization
            </h3>

            <p className="mt-3 text-slate-600">
              Store field data locally and synchronize pending updates with the
              central system when internet connectivity is restored.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}