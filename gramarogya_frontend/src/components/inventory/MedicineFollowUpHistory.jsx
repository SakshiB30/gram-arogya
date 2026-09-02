import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFollowUpsByBeneficiary,
} from "../../redux/slices/medicineFollowUpSlice";

const MedicineFollowUpHistory = ({ beneficiaryId }) => {
  const dispatch = useDispatch();

  const {
    followUps = [],
    loading,
    error,
  } = useSelector((state) => state.medicineFollowUp);

  useEffect(() => {
    if (beneficiaryId) {
      dispatch(getFollowUpsByBeneficiary(beneficiaryId));
    }
  }, [dispatch, beneficiaryId]);


  // ==================================================
  // BADGE HELPERS
  // ==================================================

  const getMedicineBadge = (value) => {
    switch (value) {
      case "YES":
        return "bg-green-100 text-green-700";

      case "PARTIALLY":
        return "bg-orange-100 text-orange-700";

      case "NO":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  const getSymptomBadge = (value) => {
    switch (value) {
      case "IMPROVING":
        return "bg-green-100 text-green-700";

      case "SAME":
        return "bg-yellow-100 text-yellow-700";

      case "WORSE":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  const getSideEffectBadge = (value) => {
    switch (value) {
      case "NONE":
        return "bg-green-100 text-green-700";

      case "MILD":
        return "bg-yellow-100 text-yellow-700";

      case "MODERATE":
        return "bg-orange-100 text-orange-700";

      case "SEVERE":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  // ==================================================
  // CHECK WHETHER FOLLOW-UP IS RISKY
  // ==================================================

  const isRiskyFollowUp = (followUp) => {
    return (
      followUp.needsDoctorVisit === true ||
      followUp.symptomStatus === "WORSE" ||
      followUp.sideEffects === "SEVERE"
    );
  };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
        <p className="text-gray-500">
          Loading medicine follow-ups...
        </p>
      </div>
    );
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }


  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-6">

        <h2 className="text-xl font-semibold text-gray-800">
          Medicine Follow-up History
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Track medicine adherence, symptoms and follow-up progress.
        </p>

      </div>


      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {followUps.length === 0 ? (

        <div className="text-center py-8">

          <p className="text-gray-500">
            No medicine follow-up records found.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {followUps.map((followUp, index) => {

            const isLatest = index === 0;

            const risky = isRiskyFollowUp(followUp);

            return (
              <div
                key={followUp.id}
                className={`relative rounded-xl p-5 border ${
                  isLatest && risky
                    ? "border-red-300 bg-red-50/30"
                    : "border-gray-200"
                }`}
              >

                {/* ==================================================
                    LATEST FOLLOW-UP WARNING
                ================================================== */}

                {isLatest && risky && (

                  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">

                    <div className="flex items-start gap-3">

                      <div className="text-red-600 text-xl">
                        ⚠
                      </div>

                      <div>

                        <h3 className="font-semibold text-red-700">
                          Attention Required
                        </h3>

                        <p className="text-sm text-red-600 mt-1">
                          The latest follow-up indicates that this
                          beneficiary may need further medical attention.
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">

                          {followUp.needsDoctorVisit && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                              Doctor Visit Required
                            </span>
                          )}

                          {followUp.symptomStatus === "WORSE" && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                              Symptoms Worsening
                            </span>
                          )}

                          {followUp.sideEffects === "SEVERE" && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                              Severe Side Effects
                            </span>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>
                )}


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">

                      <span className="text-blue-600 font-semibold">
                        {followUps.length - index}
                      </span>

                    </div>

                    <div>

                      <h3 className="font-semibold text-gray-800">
                        {isLatest
                          ? "Latest Follow-up"
                          : "Follow-up Visit"}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {followUp.followUpDate}
                      </p>

                    </div>

                  </div>

                  {followUp.needsDoctorVisit && (

                    <span className="inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      Doctor Visit Required
                    </span>

                  )}

                </div>


                {/* ==================================================
                    MAIN INFORMATION
                ================================================== */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  {/* Medicine */}

                  <div className="bg-gray-50 rounded-lg p-3">

                    <p className="text-xs text-gray-500 mb-1">
                      Medicine Taken
                    </p>

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getMedicineBadge(
                        followUp.medicineTaken
                      )}`}
                    >
                      {followUp.medicineTaken}
                    </span>

                  </div>


                  {/* Symptoms */}

                  <div className="bg-gray-50 rounded-lg p-3">

                    <p className="text-xs text-gray-500 mb-1">
                      Symptoms
                    </p>

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getSymptomBadge(
                        followUp.symptomStatus
                      )}`}
                    >
                      {followUp.symptomStatus}
                    </span>

                  </div>


                  {/* Side Effects */}

                  <div className="bg-gray-50 rounded-lg p-3">

                    <p className="text-xs text-gray-500 mb-1">
                      Side Effects
                    </p>

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getSideEffectBadge(
                        followUp.sideEffects
                      )}`}
                    >
                      {followUp.sideEffects}
                    </span>

                  </div>

                </div>


                {/* ==================================================
                    SIDE EFFECT DETAILS
                ================================================== */}

                {followUp.sideEffectDetails && (

                  <div className="mt-4">

                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Side Effect Details
                    </p>

                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                      {followUp.sideEffectDetails}
                    </p>

                  </div>

                )}


                {/* ==================================================
                    REFERRAL REASON
                ================================================== */}

                {followUp.needsDoctorVisit &&
                  followUp.referralReason && (

                    <div className="mt-4 border border-red-200 bg-red-50 rounded-lg p-4">

                      <p className="text-sm font-semibold text-red-700 mb-1">
                        Reason for Doctor Visit
                      </p>

                      <p className="text-sm text-red-600">
                        {followUp.referralReason}
                      </p>

                    </div>

                  )}


                {/* ==================================================
                    REMARKS
                ================================================== */}

                {followUp.remarks && (

                  <div className="mt-4 pt-4 border-t border-gray-100">

                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </p>

                    <p className="text-sm text-gray-600">
                      {followUp.remarks}
                    </p>

                  </div>

                )}


                {/* ==================================================
                    CREATED TIME
                ================================================== */}

                <div className="mt-4 pt-4 border-t border-gray-100">

                  <p className="text-xs text-gray-400">

                    Recorded on{" "}

                    {followUp.createdAt
                      ? new Date(
                          followUp.createdAt
                        ).toLocaleString()
                      : followUp.followUpDate}

                  </p>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default MedicineFollowUpHistory;