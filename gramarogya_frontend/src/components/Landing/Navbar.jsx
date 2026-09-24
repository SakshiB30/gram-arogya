import { Link } from "react-router-dom";
import { ShieldPlus, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Container from "./Container";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Workflow", href: "#workflow" },
    { label: "Contact", href: "#contact" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(15,23,42,0.08)] border-b border-slate-200/60"
        : "bg-white/60 backdrop-blur-md border-b border-transparent"
    }`}>
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-lcinear-to-br from-blue-600 via-blue-600 to-indigo-700 shadow-lg shadow-blue-500/30 ring-1 ring-white/40 transition-all duration-300 group-hover:shadow-blue-500/50 group-hover:scale-105 group-hover:rotate-3">
            <ShieldPlus className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            ASHA
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group relative rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-blue-700"
            >
              {item.label}
              <span className="absolute inset-x-4 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="rounded-full p-2 text-slate-700 transition-colors duration-200 hover:bg-slate-100 active:scale-95 lg:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <div
        className={`overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-lg transition-all duration-300 ease-in-out lg:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Container className="flex flex-col py-4">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700"
            >
              {item.label}
            </a>
          ))}
          <hr className="my-4 border-slate-200" />
          <Link
            to="/login"
            onClick={closeMenu}
            className="rounded-full border border-slate-300 px-4 py-3 text-center font-medium text-slate-700 transition-colors duration-200 hover:border-blue-600 hover:bg-blue-50"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={closeMenu}
            className="mt-3 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-3 text-center font-semibold text-white shadow-md shadow-blue-500/25"
          >
            Get Started
          </Link>
        </Container>
      </div>
    </header>
  );
}