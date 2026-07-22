import { FileCheck2, User, Phone, MapPin, BadgeCheck } from "lucide-react";

export default function PendingVerifications({
  verifications = [],
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <FileCheck2
          className="text-violet-600"
          size={22}
        />

        <h2 className="text-lg font-semibold">
          Pending User Verifications
        </h2>
      </div>

      {verifications.length === 0 ? (

        <div className="py-10 text-center text-slate-400">
          No pending user verifications
        </div>

      ) : (

        <div className="space-y-4">

          {verifications.map((item) => (

            <div
              key={item.id}
              className="rounded-xl border border-slate-100 p-5 transition hover:bg-slate-50"
            >

              <div className="flex items-start justify-between">

                {/* Left */}
                <div className="space-y-2">

                  <h3 className="text-lg font-semibold text-slate-800">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <BadgeCheck
                      size={16}
                      className="text-violet-600"
                    />
                    <span>
                      {item.role} • {item.employeeId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin
                      size={16}
                      className="text-blue-600"
                    />
                    <span>{item.village}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone
                      size={16}
                      className="text-green-600"
                    />
                    <span>{item.phone}</span>
                  </div>

                </div>

                {/* Status */}
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                  {item.status}
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

