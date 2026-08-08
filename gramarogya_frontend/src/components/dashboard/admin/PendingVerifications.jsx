import {
  FileCheck2,
  Phone,
  MapPin,
  BadgeCheck,
  CheckCircle,
} from "lucide-react";

import { useDispatch } from "react-redux";
import { approveAnm, fetchPendingAnms, rejectAnm } from "../../../redux/slices/adminSlice";
import { fetchDashboard  } from "../../../redux/slices/dashboardSlice";

export default function PendingVerifications({
  verifications = [],
}) {

  const dispatch = useDispatch();

  const handleApprove = async (id) => {

    await dispatch(approveAnm(id));

    dispatch(fetchDashboard());

};

const handleReject = async (id) => {

    if (!window.confirm("Reject this ANM registration?")) {
        return;
    }

    await dispatch(rejectAnm(id));

    dispatch(fetchDashboard());

};

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <FileCheck2
            className="text-violet-600"
            size={22}
          />

          <h2 className="text-lg font-semibold">
            Pending ANM Verifications
          </h2>

        </div>

        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
          {verifications.length}
        </span>

      </div>

      {verifications.length === 0 ? (

        <div className="py-10 text-center text-slate-400">
          No pending ANM registrations 🎉
        </div>

      ) : (

        <div className="space-y-4">

          {verifications.map((item) => (

            <div
              key={item.id}
              className="rounded-xl border border-slate-200 p-5 transition hover:shadow-md"
            >

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                {/* Left */}

                <div>

                  <h3 className="text-lg font-semibold text-slate-800">
                    {item.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">

                    <BadgeCheck
                      size={16}
                      className="text-violet-600"
                    />

                    <span>
                      {item.role}
                    </span>

                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">

                    <MapPin
                      size={16}
                      className="text-blue-600"
                    />

                    <span>
                      {item.village || "Not Provided"}
                    </span>

                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">

                    <Phone
                      size={16}
                      className="text-green-600"
                    />

                    <span>
                      {item.phone || "Not Provided"}
                    </span>

                  </div>

                  <div className="mt-2 text-sm text-slate-500">
                    {item.email}
                  </div>

                </div>

                {/* Right */}

                <div className="flex flex-col items-end gap-3">

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    Pending
                  </span>

                  <div className="flex gap-2">

    <button
        onClick={() => handleApprove(item.id)}
        className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
    >
        Approve
    </button>

    <button
        onClick={() => handleReject(item.id)}
        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
    >
        Reject
    </button>

</div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}