import { Link } from "react-router-dom";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-12 text-slate-400">
      <Container>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold text-white">GramArogya</h3>
            <p className="mt-4 text-sm leading-relaxed">
              Empowering rural healthcare with digital transformation. Connecting ASHA Workers, ANMs and PHCs for efficient patient care.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white transition">About the Platform</a></li>
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Connect</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>support@gramarogya.in</li>
              <li>+91 1800-123-4567</li>
              <li className="text-xs text-slate-500 mt-2">Ministry of Health & Family Welfare</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} GramArogya. All Rights Reserved.</p>
        </div>
      </Container>
    </footer>
  );
}