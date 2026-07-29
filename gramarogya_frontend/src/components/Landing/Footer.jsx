import { Link } from "react-router-dom";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-8 text-slate-400">
      <Container className="flex flex-col items-center justify-between gap-6 text-sm md:flex-row">
        {/* Left */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-white">
            GramArogya
          </h3>

          <p className="mt-2 max-w-sm leading-relaxed">
            A Rural Healthcare Management Platform connecting
            ASHA Workers, ANMs and PHCs for efficient patient
            care and digital health services.
          </p>

          <p className="mt-4 text-xs text-slate-500">
            © {new Date().getFullYear()} GramArogya. All Rights Reserved.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col items-center gap-3 md:items-end">
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              to="/login"
              className="hover:text-white transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="hover:text-white transition"
            >
              Register
            </Link>

            <a
              href="#features"
              className="hover:text-white transition"
            >
              Features
            </a>

            <a
              href="#about"
              className="hover:text-white transition"
            >
              About
            </a>
          </div>

          <p className="text-xs text-slate-500">
            Ministry of Health & Family Welfare • Digital India
          </p>
        </div>
      </Container>
    </footer>
  );
}