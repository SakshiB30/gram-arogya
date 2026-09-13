import {
  CalendarDays,
  MapPin,
  CheckCircle,
} from "lucide-react";

const TodaySchedule = ({ visits = [], loading = false }) => {

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">

        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Today's Visits
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your scheduled visits for today
            </p>
          </div>

          <CalendarDays
            size={24}
            className="text-blue-600"
          />

        </div>

        <div className="py-8 text-center text-gray-500">
          Loading today's visits...
        </div>

      </div>
    );
  }


  // ==============================
  // EMPTY STATE
  // ==============================

  if (!visits || visits.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">

        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Today's Visits
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your scheduled visits for today
            </p>
          </div>

          <CalendarDays
            size={24}
            className="text-blue-600"
          />

        </div>


        <div className="py-10 text-center">

          <CalendarDays
            size={40}
            className="mx-auto text-gray-300 mb-3"
          />

          <h3 className="font-semibold text-gray-700">
            No visits scheduled for today
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            You have no scheduled visits today.
          </p>

        </div>

      </div>
    );
  }


  // ==============================
  // VISITS
  // ==============================

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-xl font-bold text-gray-800">
            Today's Visits
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {visits.length} visit
            {visits.length !== 1 ? "s" : ""} scheduled for today
          </p>

        </div>

        <CalendarDays
          size={24}
          className="text-blue-600"
        />

      </div>


      {/* Visit List */}

      <div className="space-y-3">

        {visits.map((visit) => (

          <div
            key={visit.id}
            className="
              flex
              items-center
              gap-4
              border
              border-gray-100
              rounded-xl
              p-4
              hover:bg-gray-50
              transition
            "
          >

            {/* Date Icon */}

            <div
              className="
                w-14
                h-14
                shrink-0
                flex
                items-center
                justify-center
                bg-blue-50
                rounded-xl
              "
            >

              <CalendarDays
                size={24}
                className="text-blue-600"
              />

            </div>


            {/* Visit Details */}

            <div className="flex-1 min-w-0">

              <h3 className="font-semibold text-gray-800 truncate">
                {visit.beneficiaryName || "Beneficiary"}
              </h3>


              <p className="text-sm text-gray-500 mt-1">
                {visit.visitType || "Visit"}
              </p>


              {/* Village */}

              {visit.village && (
                <div
                  className="
                    flex
                    items-center
                    gap-1
                    mt-2
                    text-sm
                    text-gray-500
                  "
                >

                  <MapPin size={14} />

                  <span>
                    {visit.village}
                  </span>

                </div>
              )}

            </div>


            {/* Status */}

            <div className="shrink-0">

              {visit.status?.toLowerCase() === "completed" ? (

                <span
                  className="
                    flex
                    items-center
                    gap-1
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    bg-green-100
                    text-green-700
                  "
                >

                  <CheckCircle size={14} />

                  Completed

                </span>

              ) : visit.status?.toLowerCase() === "cancelled" ? (

                <span
                  className="
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    bg-red-100
                    text-red-700
                  "
                >
                  Cancelled
                </span>

              ) : (

                <span
                  className="
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    bg-yellow-100
                    text-yellow-700
                  "
                >
                  {visit.status || "Pending"}
                </span>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default TodaySchedule;

