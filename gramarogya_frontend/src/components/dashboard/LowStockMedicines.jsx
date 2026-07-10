import React from "react";
import {
  Pill,
  AlertTriangle,
} from "lucide-react";

export default function LowStockMedicines({
  medicines = [],
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-lg font-bold text-slate-900">
          Medicine Alerts
        </h2>

        <AlertTriangle
          size={22}
          className="text-red-600"
        />

      </div>

      {medicines.length === 0 ? (

        <div className="py-10 text-center text-slate-500">
          No medicine alerts.
        </div>

      ) : (

        <div className="space-y-4">

          {medicines.map((medicine) => (

            <div
              key={medicine.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">

                  <Pill
                    size={18}
                    className="text-red-600"
                  />

                </div>

                <div>

                  <h4 className="font-semibold text-slate-800">
                    {medicine.name}
                  </h4>

                  <p className="text-sm text-slate-500">
                    Batch : {medicine.batch}
                  </p>

                </div>

              </div>

              <div className="text-right">

                <p className="font-semibold text-slate-900">
                  {medicine.stock} Units
                </p>

                <span
                  className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    medicine.status === "Out of Stock"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {medicine.status}
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}