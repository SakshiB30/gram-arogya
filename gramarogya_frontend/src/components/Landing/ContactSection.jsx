import {
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import Container from "./Container";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-slate-50 py-20"
    >
      <Container>

        {/* Section Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Contact Us
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-900">
            Need Help?
          </h2>

          <p className="mt-4 text-slate-600 leading-8">
            Whether you're an ASHA Worker, ANM, Medical Officer, or PHC
            Administrator, we're here to help you get started with
            GramArogya.
          </p>

        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">

          {/* Contact Information */}

          <div className="space-y-8">

            <div>

              <h3 className="text-2xl font-bold text-slate-900">
                Contact Information
              </h3>

              <p className="mt-3 text-slate-600 leading-7">
                Reach out to our support team for technical assistance,
                onboarding, or any questions regarding the GramArogya
                platform.
              </p>

            </div>

            <div className="space-y-5">

              <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">

                <div className="rounded-lg bg-blue-100 p-3">
                  <Phone className="h-5 w-5 text-blue-700" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    Phone
                  </h4>
                  <p className="mt-1 text-slate-600">
                    +91 1800-123-4567
                  </p>
                </div>

              </div>

              <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">

                <div className="rounded-lg bg-emerald-100 p-3">
                  <Mail className="h-5 w-5 text-emerald-700" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    Email
                  </h4>
                  <p className="mt-1 text-slate-600">
                    support@gramarogya.in
                  </p>
                </div>

              </div>

              <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">

                <div className="rounded-lg bg-orange-100 p-3">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    Address
                  </h4>

                  <p className="mt-1 text-slate-600">
                    Primary Health Center Support Cell
                    <br />
                    Ministry of Health & Family Welfare
                    <br />
                    New Delhi, India
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Contact Form */}

          <div className="rounded-2xl bg-white p-8 shadow-lg">

            <h3 className="text-2xl font-bold text-slate-900">
              Send us a Message
            </h3>

            <p className="mt-2 text-slate-500">
              We'll get back to you as soon as possible.
            </p>

            <form className="mt-8 space-y-5">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Message
                </label>

                <textarea
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                <Send className="h-5 w-5" />
                Send Message
              </button>

            </form>

          </div>

        </div>

      </Container>
    </section>
  );
}