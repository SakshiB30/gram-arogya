import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  Activity,
} from "lucide-react";

import {
  fetchBeneficiaryById,
  clearSelectedBeneficiary,
} from "../../redux/slices/beneficiarySlice";

import {
  fetchVisitsByBeneficiary,
  clearBeneficiaryVisits,
} from "../../redux/slices/visitSlice";

import { getErrorMessage } from "../../utils/apiError";

// Offline network status
import useNetworkStatus from "../../offline/useNetworkStatus";

export default function BeneficiaryDetail() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check internet connection
  const online = useNetworkStatus();

  const {
    selectedBeneficiary,
    loading,
    error,
  } = useSelector((state) => state.beneficiaries);

  const {
    beneficiaryVisits,
  } = useSelector((state) => state.visits);

  useEffect(() => {
    // Fetch beneficiary
    dispatch(fetchBeneficiaryById(id));

    // Fetch previous visits
    dispatch(fetchVisitsByBeneficiary(id));

    return () => {
      dispatch(clearSelectedBeneficiary());
      dispatch(clearBeneficiaryVisits());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500">
        Loading beneficiary...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {getErrorMessage(error)}
      </div>
    );
  }

  if (!selectedBeneficiary) {
    return (
      <div className="p-6 text-center">
        Beneficiary not found.
      </div>
    );
  }

  const beneficiary = selectedBeneficiary;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {beneficiary.name}
          </h1>

          <p className="mt-2 text-slate-500">
            Beneficiary Details
          </p>
        </div>
      </div>

      {/* Offline Mode Indicator */}
      {!online && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="font-semibold text-red-700">
            Offline Mode
          </p>

          <p className="mt-1 text-sm text-red-600">
            Showing beneficiary and visit information from local storage.
          </p>
        </div>
      )}

      {/* Details Card */}
      <div className="rounded-xl border bg-white shadow-sm">

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
            p-6
          "
        >

          {/* Name */}
          <Info
            icon={<User size={18} />}
            label="Name"
            value={beneficiary.name}
          />

          {/* Age */}
          <Info
            icon={<Activity size={18} />}
            label="Age"
            value={
              beneficiary.age
                ? `${beneficiary.age} years`
                : "-"
            }
          />

          {/* Gender */}
          <Info
            icon={<User size={18} />}
            label="Gender"
            value={beneficiary.gender}
          />

          {/* Phone */}
          <Info
            icon={<Phone size={18} />}
            label="Phone"
            value={beneficiary.phone}
          />

          {/* Village */}
          <Info
            icon={<MapPin size={18} />}
            label="Village"
            value={beneficiary.village}
          />

          {/* Address */}
          <Info
            icon={<MapPin size={18} />}
            label="Address"
            value={beneficiary.address}
          />

          {/* Assigned ASHA */}
          <Info
            icon={<User size={18} />}
            label="Assigned ASHA"
            value={beneficiary.ashaName || "-"}
          />

          {/* Category */}
          <Info
            icon={<User size={18} />}
            label="Category"
            value={beneficiary.category}
          />

          {/* Disease */}
          <Info
            icon={<Activity size={18} />}
            label="Disease"
            value={beneficiary.disease}
          />

          {/* Status */}
          <Info
            icon={<Activity size={18} />}
            label="Status"
            value={beneficiary.status}
          />

          {/* Date Added */}
          <Info
            icon={<Calendar size={18} />}
            label="Date Added"
            value={beneficiary.dateAdded}
          />

          {/* Last Visit */}
          <Info
            icon={<Calendar size={18} />}
            label="Last Visit"
            value={beneficiary.lastVisitDate}
          />

          {/* Next Visit */}
          <Info
            icon={<Calendar size={18} />}
            label="Next Visit"
            value={beneficiary.nextVisitDate}
          />

        </div>
      </div>

      {/* =====================================================
          PREVIOUS VISITS
      ===================================================== */}

      <div className="rounded-xl border bg-white shadow-sm">

  {/* Header */}
  <div className="border-b px-6 py-4">
    <div className="flex items-center gap-2">
      <Calendar size={20} className="text-blue-600" />

      <h2 className="text-xl font-semibold text-slate-900">
        Previous Visits
      </h2>
    </div>
  </div>

  {/* Content */}
  <div className="p-6">

    {beneficiaryVisits.length === 0 ? (
      <p className="py-6 text-center text-slate-500">
        No previous visits found.
      </p>
    ) : (
      <div className="overflow-x-auto">

        <table className="w-full text-left text-sm">

          {/* Table Header */}
          <thead>
            <tr className="border-b bg-slate-50 text-slate-600">

              <th className="px-4 py-3 font-medium">
                Visit Date
              </th>

              <th className="px-4 py-3 font-medium">
                Visit Type
              </th>

              <th className="px-4 py-3 font-medium">
                Status
              </th>

              <th className="px-4 py-3 font-medium">
                Next Visit
              </th>

              <th className="px-4 py-3 font-medium">
                Notes
              </th>

              <th className="px-4 py-3 font-medium">
                Sync Status
              </th>

            </tr>
          </thead>

          {/* Table Body */}
          <tbody>

            {beneficiaryVisits.map((visit) => (
              <tr
                key={visit.id}
                className="border-b last:border-b-0 hover:bg-slate-50"
              >

                {/* Visit Date */}
                <td className="px-4 py-4 text-slate-800">
                  {visit.visitDate ||
                    visit.scheduledDate ||
                    "-"}
                </td>

                {/* Visit Type */}
                <td className="px-4 py-4 text-slate-700">
                  {visit.visitType || "-"}
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-medium
                      ${
                        visit.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : visit.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : visit.status === "Missed"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-600"
                      }
                    `}
                  >
                    {visit.status || "-"}
                  </span>
                </td>

                {/* Next Visit */}
                <td className="px-4 py-4 text-slate-700">
                  {visit.nextVisitDate || "-"}
                </td>

                {/* Notes */}
                <td className="max-w-xs px-4 py-4 text-slate-600">
                  {visit.notes || "-"}
                </td>

                {/* Sync Status */}
                <td className="px-4 py-4">

                  {visit.syncStatus &&
                  visit.syncStatus !== "SYNCED" ? (
                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-medium
                        ${
                          visit.syncStatus === "FAILED"
                            ? "bg-red-100 text-red-700"
                            : visit.syncStatus === "SYNCING"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >
                      {visit.syncStatus === "PENDING"
                        ? "Pending Sync"
                        : visit.syncStatus === "SYNCING"
                        ? "Syncing..."
                        : "Sync Failed"}
                    </span>
                  ) : (
                    <span className="text-sm text-green-600">
                      Synced
                    </span>
                  )}

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    )}

  </div>
</div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/app/beneficiaries")}
        className="
          flex items-center gap-2
          rounded-lg
          border
          px-4 py-2
          hover:bg-slate-100
        "
      >
        <ArrowLeft size={18} />
        Back
      </button>

    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
        rounded-lg
        border
        p-4
      "
    >
      <div className="text-blue-600">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="font-semibold text-slate-900">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

