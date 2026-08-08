import { Link } from "react-router-dom";
import Container from "./Container";
import { Globe2, MapPin, Building2, ArrowRight } from "lucide-react";

export default function MapSection() {
  return (
    <section className="py-16 bg-slate-50">
      <Container>
        <div className="mb-10 text-center">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">Coverage</span>
          <h2 className="mt-4 text-3xl font-bold text-slate-900">Connecting Healthcare Services</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="font-semibold">Beneficiary Management</h4>
                <p className="text-sm text-slate-600">Maintain digital records of all registered beneficiaries.</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="font-semibold">Medicine Inventory</h4>
                <p className="text-sm text-slate-600">Track medicine stock, expiry dates and restocking.</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="font-semibold">Health Records</h4>
                <p className="text-sm text-slate-600">Store and access patient health history securely.</p>
              </div>
            </div>
            <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
              Register PHC <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-white to-emerald-100 p-10 shadow-lg">
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
                <Globe2 className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Rural Healthcare Network</h3>
              <div className="mt-6 flex justify-center gap-4">
                <div className="rounded-xl bg-white px-4 py-3 shadow-sm"><MapPin className="h-5 w-5 text-blue-700" /><p className="text-xs font-semibold">PHC</p></div>
                <div className="rounded-xl bg-white px-4 py-3 shadow-sm"><Building2 className="h-5 w-5 text-emerald-700" /><p className="text-xs font-semibold">ANM</p></div>
                <div className="rounded-xl bg-white px-4 py-3 shadow-sm"><Globe2 className="h-5 w-5 text-indigo-700" /><p className="text-xs font-semibold">ASHA</p></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}