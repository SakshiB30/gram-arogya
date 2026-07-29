import { Link } from "react-router-dom";
import { ShieldPlus, Menu, X } from "lucide-react";
import { useState } from "react";
import Container from "./Container";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <Container className="flex h-16 items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 shadow">
            <ShieldPlus className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              GramArogya
            </h1>

            <p className="text-xs text-slate-500">
              Rural Healthcare Management
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition duration-200 hover:text-blue-700 hover:underline underline-offset-8"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 lg:flex">

          <Link
            to="/login"
            className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-700 hover:text-blue-700"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Get Started
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
        >
          {menuOpen ? (
            <X className="h-6 w-6 text-slate-700" />
          ) : (
            <Menu className="h-6 w-6 text-slate-700" />
          )}
        </button>
      </Container>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white shadow-lg lg:hidden">

          <Container className="flex flex-col py-4">

            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="rounded-md px-2 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-700"
              >
                {item.label}
              </a>
            ))}

            <hr className="my-4" />

            <Link
              to="/login"
              onClick={closeMenu}
              className="rounded-lg border border-slate-300 px-4 py-3 text-center font-medium text-slate-700 transition hover:border-blue-700 hover:text-blue-700"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="mt-3 rounded-lg bg-blue-700 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-800"
            >
              Get Started
            </Link>

          </Container>

        </div>
      )}
    </header>
  );
}