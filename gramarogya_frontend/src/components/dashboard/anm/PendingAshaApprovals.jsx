import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, X, UserRound } from "lucide-react";

import {
  fetchPendingAshas,
  approveAsha,
  rejectAsha,
} from "../../../redux/slices/anmSlice";

export default function PendingAshaApprovals() {

  const dispatch = useDispatch();

  const {
    pendingAshas,
    loading,
    actionLoading,
    error,
  } = useSelector((state) => state.anm);

  useEffect(() => {
    dispatch(fetchPendingAshas());
  }, [dispatch]);

  const handleApprove = async (id) => {
    try {
      await dispatch(approveAsha(id)).unwrap();
    } catch (error) {
      alert(error || "Failed to approve ASHA");
    }
  };

  const handleReject = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to reject this ASHA?"
    );

    if (!confirmed) return;

    try {
      await dispatch(rejectAsha(id)).unwrap();
    } catch (error) {
      alert(error || "Failed to reject ASHA");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      <div className="flex items-center justify-between mb-5">

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Pending ASHA Approvals
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Review ASHA registrations assigned to you
          </p>
        </div>

        <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
          {pendingAshas.length} Pending
        </div>

      </div>

      {loading && (
        <div className="flex justify-center py-8">

          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && pendingAshas.length === 0 && (
        <div className="text-center py-10 text-gray-500">

          <UserRound
            size={40}
            className="mx-auto mb-3 text-gray-400"
          />

          <p className="font-medium">
            No pending ASHA registrations
          </p>

          <p className="text-sm mt-1">
            You're all caught up.
          </p>

        </div>
      )}

      {!loading && pendingAshas.length > 0 && (
        <div className="space-y-4">

          {pendingAshas.map((asha) => (

            <div
              key={asha.id}
              className="border rounded-xl p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >

              <div className="flex items-center gap-4">

                <div className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center">

                  <UserRound
                    size={21}
                    className="text-blue-600"
                  />

                </div>

                <div>

                  <h3 className="font-semibold text-gray-800">
                    {asha.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {asha.email}
                  </p>

                  <p className="text-sm text-gray-500">
                    {asha.phone || "No phone number"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {asha.village || "-"}
                    {asha.district
                      ? ` • ${asha.district}`
                      : ""}
                  </p>

                </div>

              </div>


              <div className="flex gap-3">

                <button
                  onClick={() => handleApprove(asha.id)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  <Check size={17} />
                  Approve
                </button>

                <button
                  onClick={() => handleReject(asha.id)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  <X size={17} />
                  Reject
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}