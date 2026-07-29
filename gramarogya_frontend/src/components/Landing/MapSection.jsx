import { Link } from "react-router-dom";
import Container from "./Container";
import { Globe2, MapPin, Building2, ArrowRight } from "lucide-react";

export default function MapSection() {
  const highlights = [
    {
      title: "Beneficiary Management",
      description: "Maintain digital records of all registered beneficiaries.",
    },
    {
      title: "Medicine Inventory",
      description: "Track medicine stock, expiry dates and restocking.",
    },
    {
      title: "Health Records",
      description: "Store and access patient health history securely.",
    },
    {
      title: "Visit Monitoring",
      description: "Monitor home visits performed by ASHA workers.",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <Container>

        <div className="mb-12 text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            GramArogya Coverage
          </span>

          <h2 className="mt-4 text-3xl font-bold text-slate-900">
            Connecting Primary Healthcare Services
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-slate-600">
            GramArogya enables seamless collaboration between Administrators,
            ANMs, ASHA workers, and beneficiaries through one integrated
            healthcare management platform.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Left Card */}
          <div className="rounded-3xl bg-white p-8 shadow-lg">

            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3">
                <Building2 className="h-6 w-6 text-blue-700" />
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Digital PHC Management
                </h3>
                <p className="text-sm text-slate-500">
                  Everything managed in one secure platform.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <h4 className="font-semibold text-slate-900">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Register Your PHC
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          {/* Right Illustration */}
          <div className="relative flex items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 via-white to-emerald-100 p-10 shadow-lg">

            <div className="text-center">

              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-lg">
                <Globe2 className="h-14 w-14 text-blue-600" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                Rural Healthcare Network
              </h3>

              <p className="mx-auto mt-3 max-w-md text-slate-600">
                Empowering Primary Health Centers with secure digital records,
                medicine inventory, visit tracking, and beneficiary management.
              </p>

              <div className="mt-8 flex justify-center gap-6">

                <div className="rounded-xl bg-white px-6 py-4 shadow">
                  <MapPin className="mx-auto mb-2 h-6 w-6 text-blue-700" />
                  <p className="text-sm font-semibold">
                    PHC
                  </p>
                </div>

                <div className="rounded-xl bg-white px-6 py-4 shadow">
                  <Building2 className="mx-auto mb-2 h-6 w-6 text-emerald-700" />
                  <p className="text-sm font-semibold">
                    ANM
                  </p>
                </div>

                <div className="rounded-xl bg-white px-6 py-4 shadow">
                  <Globe2 className="mx-auto mb-2 h-6 w-6 text-indigo-700" />
                  <p className="text-sm font-semibold">
                    ASHA
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </Container>
    </section>
  );
}