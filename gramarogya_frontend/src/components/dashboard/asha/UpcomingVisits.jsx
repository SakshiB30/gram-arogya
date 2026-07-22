import React from "react";
import { CalendarDays, User } from "lucide-react";

export default function UpcomingVisits({
  visits = [],
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-lg font-bold text-slate-900">
          Upcoming Visits
        </h2>

        <CalendarDays
          className="text-blue-600"
          size={22}
        />

      </div>

      {visits.length === 0 ? (

        <div className="py-10 text-center text-slate-500">
          No upcoming visits.
        </div>

      ) : (

        <div className="space-y-4">

          {visits.map((visit) => (

            <div
              key={visit.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                  <User
                    size={18}
                    className="text-blue-600"
                  />
                </div>

                <div>

                  <h4 className="font-semibold text-slate-800">
                    {visit.beneficiaryName}
                  </h4>

                  <p className="text-sm text-slate-500">
                    {visit.visitType}
                  </p>

                </div>

              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {visit.nextVisitDate}
              </span>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}