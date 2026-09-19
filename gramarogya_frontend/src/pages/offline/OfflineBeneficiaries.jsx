import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Users, User, Baby, WifiOff } from "lucide-react";

import {
  getOfflineBeneficiaries,
} from "../../offline/beneficiaryOfflineService";


const OfflineBeneficiaries = () => {
  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );

  const [beneficiaries, setBeneficiaries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  useEffect(() => {
    const loadBeneficiaries = async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getOfflineBeneficiaries(
            user?.id
          );

        setBeneficiaries(data || []);
      } catch (err) {
        console.error(
          "Failed to load offline beneficiaries:",
          err
        );

        setError(
          "Failed to load offline beneficiaries."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadBeneficiaries();
    } else {
      setLoading(false);
    }
  }, [user?.id]);


  const normalize = (value) =>
    value?.trim().toLowerCase();


  const total =
    beneficiaries.length;

  const pregnantWomen =
    beneficiaries.filter(
      (b) =>
        normalize(b.category) ===
        "pregnant woman"
    ).length;

  const children =
    beneficiaries.filter(
      (b) =>
        normalize(b.category) ===
        "child"
    ).length;


  const stats = [
    {
      title: "Total Beneficiaries",
      value: total,
      icon: Users,
      color:
        "bg-blue-100 text-blue-600",
    },
    {
      title: "Pregnant Women",
      value: pregnantWomen,
      icon: User,
      color:
        "bg-orange-100 text-orange-600",
    },
    {
      title: "Children Under 5",
      value: children,
      icon: Baby,
      color:
        "bg-green-100 text-green-600",
    },
  ];


  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            My Beneficiaries
          </h1>

          <p className="mt-1 text-gray-500">
            Assigned beneficiaries available offline
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
          <WifiOff size={17} />
          Offline
        </div>

      </div>


      {/* Stats */}

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">

        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-6 shadow"
            >

              <div className="flex justify-between">

                <div>

                  <p className="text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {item.value}
                  </h2>

                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${item.color}`}
                >
                  <Icon size={24} />
                </div>

              </div>

            </div>
          );
        })}

      </div>


      {/* Main Card */}

      <div className="overflow-hidden rounded-2xl bg-white shadow">

        {/* Loading */}

        {loading && (
          <div className="flex items-center justify-center py-16">

            <div
              className="
                h-10 w-10
                animate-spin
                rounded-full
                border-4
                border-blue-500
                border-t-transparent
              "
            />

          </div>
        )}


        {/* Error */}

        {!loading && error && (
          <div className="p-6">

            <div className="rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>

          </div>
        )}


        {/* Empty */}

        {!loading &&
          !error &&
          beneficiaries.length === 0 && (
            <div className="py-16 text-center">

              <Users
                size={48}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-4 text-xl font-semibold">
                No Offline Beneficiaries
              </h2>

              <p className="mt-2 text-gray-500">
                Your assigned beneficiaries will appear here
                after they are loaded while online.
              </p>

            </div>
          )}


        {/* Table */}

        {!loading &&
          !error &&
          beneficiaries.length > 0 && (
            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left">
                      #
                    </th>

                    <th className="px-6 py-4 text-left">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left">
                      Age/Gender
                    </th>

                    <th className="px-6 py-4 text-left">
                      Village
                    </th>

                    <th className="px-6 py-4 text-left">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left">
                      Status
                    </th>

                    <th className="px-6 py-4 text-center">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {beneficiaries.map(
                    (beneficiary, index) => (

                      <tr
                        key={beneficiary.id}
                        className="border-t hover:bg-gray-50"
                      >

                        <td className="px-6 py-4">
                          {index + 1}
                        </td>


                        <td className="px-6 py-4">

                          <p className="font-semibold">
                            {beneficiary.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {beneficiary.phone}
                          </p>

                        </td>


                        <td className="px-6 py-4">
                          {beneficiary.age} yrs,{" "}
                          {beneficiary.gender}
                        </td>


                        <td className="px-6 py-4">
                          {beneficiary.village}
                        </td>


                        <td className="px-6 py-4">
                          {beneficiary.category}
                        </td>


                        <td className="px-6 py-4">

                          <span
                            className="
                              rounded-full
                              bg-green-100
                              px-3 py-1
                              text-xs
                              font-semibold
                              text-green-700
                            "
                          >
                            {beneficiary.status}
                          </span>

                        </td>


                        <td className="px-6 py-4 text-center">

                          <button
                            onClick={() =>
                              navigate(
                                `/app/offline/beneficiaries/${beneficiary.id}`
                              )
                            }
                            className="
                              rounded-lg
                              bg-blue-100
                              px-4 py-2
                              text-blue-700
                              hover:bg-blue-200
                            "
                          >
                            View
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

      </div>

    </div>
  );
};


export default OfflineBeneficiaries;