import { Mail, Phone, MapPin, Sparkles } from "lucide-react";
import Container from "./Container";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-slate-50">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            <Sparkles className="h-4 w-4" />
            Contact Us
          </div>
          <h2 className="mt-6 text-3xl font-bold text-slate-900 md:text-4xl">
            Get in Touch
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <Phone className="h-8 w-8 text-blue-600 mx-auto" />
            <h4 className="mt-3 font-semibold">Phone</h4>
            <p className="text-slate-600 text-sm">+91 1800-123-4567</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <Mail className="h-8 w-8 text-emerald-600 mx-auto" />
            <h4 className="mt-3 font-semibold">Email</h4>
            <p className="text-slate-600 text-sm">support@gramarogya.in</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <MapPin className="h-8 w-8 text-orange-600 mx-auto" />
            <h4 className="mt-3 font-semibold">Address</h4>
            <p className="text-slate-600 text-sm">New Delhi, India</p>
          </div>
        </div>
      </Container>
    </section>
  );
}