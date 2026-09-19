import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  Activity,
  WifiOff,
} from "lucide-react";

import {
  getOfflineBeneficiaryById,
} from "../../offline/beneficiaryOfflineService";

import { useSelector } from "react-redux";

import db from "../../offline/db";

const OfflineBeneficiaryDetail = () => {

  const user = useSelector(
  (state) => state.auth.user
  );

  const { id } = useParams();
  const navigate = useNavigate();

  const [beneficiary, setBeneficiary] =
    useState(null);

  const [visits, setVisits] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    const loadOfflineData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get beneficiary from IndexedDB
        const beneficiaryData =
  await getOfflineBeneficiaryById(
    id,
    user?.id
  );

        if (!beneficiaryData) {
          setError(
            "Beneficiary not found in offline storage."
          );
          return;
        }

        setBeneficiary(beneficiaryData);

        // Get visits for this beneficiary
        const allVisitData =
  await db.visits
    .where("beneficiaryId")
    .equals(id)
    .toArray();

const visitData =
  allVisitData.filter(
    (visit) =>
      visit.ashaId === user?.id
  );

        // Newest visit first
        visitData.sort((a, b) => {
          const dateA = new Date(
            a.visitDate || a.scheduledDate || 0
          );

          const dateB = new Date(
            b.visitDate || b.scheduledDate || 0
          );

          return dateB - dateA;
        });

        setVisits(visitData);
      } catch (err) {
        console.error(
          "Failed to load offline beneficiary detail:",
          err
        );

        setError(
          "Failed to load beneficiary details offline."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadOfflineData();
    }
  }, [id, user?.id]);

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (status) => {
    switch (
      status?.toLowerCase()
    ) {
      case "completed":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "missed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-gray-500">
          Loading beneficiary details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          onClick={() =>
            navigate(
              "/app/offline/beneficiaries"
            )
          }
          className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          <ArrowLeft size={18} />
          Back to My Beneficiaries
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!beneficiary) {
    return (
      <div className="space-y-4">
        <button
          onClick={() =>
            navigate(
              "/app/offline/beneficiaries"
            )
          }
          className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          <ArrowLeft size={18} />
          Back to My Beneficiaries
        </button>

        <div className="rounded-xl border bg-white p-6 text-gray-500">
          Beneficiary not found.
        </div>
      </div>
    );
  }

  const lastVisit =
    visits.length > 0
      ? visits[0]
      : null;

  const nextVisit =
    visits.find(
      (visit) =>
        visit.nextVisitDate
    )?.nextVisitDate;

  return (
    <div className="space-y-6">

      {/* Header */}
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  
  <div>
    <button
      onClick={() =>
        navigate(
          "/app/offline/beneficiaries"
        )
      }
      className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
    >
      <ArrowLeft size={18} />
      Back to My Beneficiaries
    </button>

    <h1 className="text-3xl font-bold text-gray-800">
      {beneficiary.name}
    </h1>

    <p className="mt-1 text-gray-500">
      Beneficiary Details
    </p>
  </div>


  {/* ACTIONS */}
  <div className="flex flex-wrap items-center gap-3">

    <button
      onClick={() =>
        navigate(
          `/app/offline/visits/create?beneficiaryId=${beneficiary.id}`
        )
      }
      className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-violet-700"
    >
      + Start New Field Visit
    </button>

    <div className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
      <WifiOff size={17} />
      Offline
    </div>

  </div>

</div>

      {/* Beneficiary Details */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-violet-100 p-3 text-violet-600">
            <User size={24} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Personal Information
            </h2>

            <p className="text-sm text-gray-500">
              Stored locally for offline field work
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <div>
            <p className="text-sm text-gray-500">
              Name
            </p>

            <p className="mt-1 font-medium text-gray-800">
              {beneficiary.name || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Age
            </p>

            <p className="mt-1 font-medium text-gray-800">
              {beneficiary.age ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Gender
            </p>

            <p className="mt-1 font-medium text-gray-800">
              {beneficiary.gender || "-"}
            </p>
          </div>

          <div className="flex gap-3">
            <Phone
              size={18}
              className="mt-1 text-gray-400"
            />

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {beneficiary.phone || "-"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin
              size={18}
              className="mt-1 text-gray-400"
            />

            <div>
              <p className="text-sm text-gray-500">
                Village
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {beneficiary.village || "-"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Address
            </p>

            <p className="mt-1 font-medium text-gray-800">
              {beneficiary.address || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Assigned ASHA
            </p>

            <p className="mt-1 font-medium text-gray-800">
              {beneficiary.ashaName ||
                beneficiary.ashaId ||
                "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Category
            </p>

            <p className="mt-1 font-medium text-gray-800">
              {beneficiary.category || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Disease
            </p>

            <p className="mt-1 font-medium text-gray-800">
              {beneficiary.disease || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>

            <p className="mt-1 font-medium text-gray-800">
              {beneficiary.status || "-"}
            </p>
          </div>

          <div className="flex gap-3">
            <Calendar
              size={18}
              className="mt-1 text-gray-400"
            />

            <div>
              <p className="text-sm text-gray-500">
                Date Added
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {formatDate(
                  beneficiary.createdAt ||
                    beneficiary.dateAdded
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Activity
              size={18}
              className="mt-1 text-gray-400"
            />

            <div>
              <p className="text-sm text-gray-500">
                Last Visit
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {lastVisit
                  ? formatDate(
                      lastVisit.visitDate ||
                        lastVisit.scheduledDate
                    )
                  : "-"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Calendar
              size={18}
              className="mt-1 text-gray-400"
            />

            <div>
              <p className="text-sm text-gray-500">
                Next Visit
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {formatDate(nextVisit)}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Previous Visits */}
      <div className="rounded-xl border bg-white shadow-sm">

        <div className="border-b p-6">
          <div className="flex items-center gap-3">
            <Activity
              size={22}
              className="text-violet-600"
            />

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Previous Visits
              </h2>

              <p className="text-sm text-gray-500">
                Visits stored on this device
              </p>
            </div>
          </div>
        </div>

        {visits.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No visits available offline for this beneficiary.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">
                    Visit Date
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Visit Type
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Next Visit
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Notes
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Sync Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">

                {visits.map((visit) => (
                  <tr
                    key={
                      visit.id
                    }
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 text-gray-700">
                      {formatDate(
                        visit.visitDate ||
                          visit.scheduledDate
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {visit.visitType || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          visit.status
                        )}`}
                      >
                        {visit.status || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {formatDate(
                        visit.nextVisitDate
                      )}
                    </td>

                    <td className="max-w-xs px-6 py-4 text-gray-600">
                      {visit.notes || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        Offline
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default OfflineBeneficiaryDetail;