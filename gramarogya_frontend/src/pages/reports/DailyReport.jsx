import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const VILLAGES = ["Select Village", "Rampur", "Sitapur", "Lakhimpur"];

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-bold text-blue-600">{title}</h2>
      <div className="mt-2 mb-5 border-t border-slate-200" />
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex-1">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function DailyReport() {
  const [form, setForm] = useState({
    reportDate: "",
    village: "Select Village",
    households: "",
    pregnantWomenChecked: 0,
    newPregnancies: 0,
    childrenVisited: 0,
    vaccinations: 0,
    feverCases: 0,
    tbSuspects: 0,
    medicines: "",
    remarks: "",
  });

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-slate-900">Submit Daily Health Report</h1>
      <p className="text-slate-500">
        Record data collected during field visits today. Ensure all mandatory fields are accurate.
      </p>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <Section title="General Information">
          <div className="flex flex-col gap-5 sm:flex-row">
            <Field label="Report Date" required>
              <input
                type="date"
                value={form.reportDate}
                onChange={update("reportDate")}
                className={inputClass}
              />
            </Field>
            <Field label="Village / Cluster" required>
              <div className="relative">
                <select
                  value={form.village}
                  onChange={update("village")}
                  className={`${inputClass} appearance-none pr-9`}
                >
                  {VILLAGES.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </Field>
          </div>

          <Field label="Households Visited Today" required>
            <input
              type="number"
              placeholder="e.g. 25"
              value={form.households}
              onChange={update("households")}
              className={inputClass}
            />
          </Field>
        </Section>

        <Section title="Maternal & Child Health">
          <div className="flex flex-col gap-5 sm:flex-row">
            <Field label="Pregnant Women Checked">
              <input
                type="number"
                value={form.pregnantWomenChecked}
                onChange={update("pregnantWomenChecked")}
                className={inputClass}
              />
            </Field>
            <Field label="New Pregnancies Registered">
              <input
                type="number"
                value={form.newPregnancies}
                onChange={update("newPregnancies")}
                className={inputClass}
              />
            </Field>
            <Field label="Children (< 5y) Visited">
              <input
                type="number"
                value={form.childrenVisited}
                onChange={update("childrenVisited")}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Vaccinations Administered (Doses)">
            <input
              type="number"
              value={form.vaccinations}
              onChange={update("vaccinations")}
              className={inputClass}
            />
          </Field>
        </Section>

        <Section title="Disease Surveillance">
          <div className="flex flex-col gap-5 sm:flex-row">
            <Field label="Fever / Suspected Malaria / Dengue">
              <input
                type="number"
                value={form.feverCases}
                onChange={update("feverCases")}
                className={inputClass}
              />
            </Field>
            <Field label="TB Suspects Referred">
              <input
                type="number"
                value={form.tbSuspects}
                onChange={update("tbSuspects")}
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        <Section title="Inventory & Additional Notes">
          <Field label="Medicines Distributed (General)">
            <textarea
              rows={3}
              placeholder="List key medicines (e.g., Paracetamol - 50 strips, IFA - 200 tablets)"
              value={form.medicines}
              onChange={update("medicines")}
              className={inputClass}
            />
          </Field>

          <Field label="Remarks / Issues Encountered">
            <textarea
              rows={4}
              placeholder="Any specific observations, resistance from community, or urgent supplies needed..."
              value={form.remarks}
              onChange={update("remarks")}
              className={inputClass}
            />
          </Field>
        </Section>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
          <button className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Save Draft
          </button>
          <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}