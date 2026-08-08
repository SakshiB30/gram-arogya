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
      scrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/80" : "bg-white/80 backdrop-blur-sm"
    }`}>
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-200 transition group-hover:scale-105">
            <ShieldPlus className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">GramArogya</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <a key={item.label} href={item.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-700">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/login" className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-600 hover:bg-blue-50">
            Login
          </Link>
          <Link to="/register" className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:shadow-lg hover:scale-105">
            Get Started
          </Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden">
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white shadow-lg lg:hidden">
          <Container className="flex flex-col py-4">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} onClick={closeMenu} className="rounded-md px-2 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-700">
                {item.label}
              </a>
            ))}
            <hr className="my-4" />
            <Link to="/login" onClick={closeMenu} className="rounded-lg border border-slate-300 px-4 py-3 text-center font-medium text-slate-700 hover:border-blue-600">
              Login
            </Link>
            <Link to="/register" onClick={closeMenu} className="mt-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-center font-semibold text-white">
              Get Started
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}