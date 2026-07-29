import { Link } from "react-router-dom";
import { ArrowRight, LogIn } from "lucide-react";
import Container from "./Container";

export default function BottomCTA() {
  return (
    <section className="bg-linear-to-r from-blue-700 to-blue-800 py-20 text-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to Digitize Your PHC?
          </h2>

          <p className="mt-5 text-lg leading-8 text-blue-100">
            GramArogya helps ASHA workers, ANMs, and PHC administrators manage
            beneficiaries, health records, medicine inventory, and field visits
            from one secure platform.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-md transition hover:bg-slate-100"
            >
              Create Account
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <LogIn size={18} />
              Login
            </Link>

          </div>

          <p className="mt-8 text-sm text-blue-200">
            Secure access for <strong>Admin</strong>, <strong>ANM</strong>, and{" "}
            <strong>ASHA Workers</strong>.
          </p>
        </div>
      </Container>
    </section>
  );
}