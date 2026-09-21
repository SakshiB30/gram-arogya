import Container from "./Container";

export default function WorkFlowSection() {
  const steps = [
    {
      number: "01",
      title: "ASHA Login",
      description:
        "ASHA workers securely log in to access their assigned beneficiaries and field activities.",
    },
    {
      number: "02",
      title: "Access Beneficiaries",
      description:
        "View assigned beneficiary information and relevant healthcare records for fieldwork.",
    },
    {
      number: "03",
      title: "Record Visit",
      description:
        "Create or update visit information during field visits, even without internet connectivity.",
    },
    {
      number: "04",
      title: "Store Health Data",
      description:
        "Record health information such as vital measurements, diagnosis, prescription, and notes offline.",
    },
    {
      number: "05",
      title: "Queue Changes",
      description:
        "Offline changes are securely stored locally and kept in a pending synchronization queue.",
    },
    {
      number: "06",
      title: "Sync When Online",
      description:
        "Pending changes are automatically synchronized with the central system when connectivity returns.",
    },
  ];

  return (
    <section id="workflow" className="py-24 bg-slate-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4">
            How It Works
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            From Field Visit to Central System
          </h2>

          <p className="text-lg text-slate-600">
            GramArogya keeps ASHA fieldwork moving offline and synchronizes
            pending healthcare data when internet connectivity is restored.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative p-8 bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-5xl font-bold text-blue-100 mb-5">
                {step.number}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {step.title}
              </h3>

              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}