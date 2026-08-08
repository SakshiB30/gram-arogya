import Container from "./Container";
import { Target, Eye, HeartHandshake, Users, ShieldCheck } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-slate-50">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">About GramArogya</span>
          <h2 className="mt-5 text-3xl font-bold text-slate-900 md:text-4xl">
            A curriculum designed for impact
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            This comprehensive platform distills decades of healthcare experience into actionable frameworks. Step away from the day-to-day and focus on what truly drives rural healthcare success.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">Strategic Vision</h3>
            <p className="mt-3 text-slate-600">
              Learn frameworks for making high-impact decisions under pressure, balancing data-driven insights with intuition to guide your organization forward.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">Empowered Teams</h3>
            <p className="mt-3 text-slate-600">
              Discover techniques to build trust, delegate effectively, and create a culture where every team member feels valued and motivated to contribute.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">Navigating Change</h3>
            <p className="mt-3 text-slate-600">
              Master the art of leading through transformation, from communicating vision to managing resistance and sustaining momentum during shifts.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}