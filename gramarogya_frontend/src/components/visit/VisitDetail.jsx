import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MedicineFollowUpForm from "../inventory/MedicineFollowUpForm"; 
import MedicineFollowUpHistory from "../inventory/MedicineFollowUpHistory";
import {
  fetchVisitById,
} from "../../redux/slices/visitSlice";

const VisitDetail = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedVisit,
    loading,
    error,
  } = useSelector((state) => state.visit);

  useEffect(() => {
    dispatch(fetchVisitById(id));
  }, [dispatch, id]);

  const statusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Convert backend error object into a readable message
  const getErrorMessage = (error) => {
    if (!error) {
      return "";
    }

    // If error is already a string
    if (typeof error === "string") {
      return error;
    }

    // Spring Boot error response
    if (error.message) {
      return error.message;
    }

    return "Failed to load visit details.";
  };

  // Loading
  if (loading) {
    return (
      <div className="
        min-h-screen
        flex
        justify-center
        items-center
        bg-gray-100
      ">
        Loading...
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="
        min-h-screen
        bg-gray-100
        p-6
      ">
        <div className="
          max-w-4xl
          mx-auto
        ">
          <div className="
            bg-red-100
            border
            border-red-200
            text-red-700
            p-5
            rounded-xl
          ">
            <h2 className="font-semibold text-lg">
              Failed to Load Visit
            </h2>

            <p className="mt-2">
              {getErrorMessage(error)}
            </p>

            <button
              onClick={() => navigate("/app/visit")}
              className="
                mt-4
                bg-red-600
                hover:bg-red-700
                text-white
                px-5
                py-2
                rounded-lg
              "
            >
              Back to Visits
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No visit
  if (!selectedVisit) {
    return (
      <div className="
        min-h-screen
        flex
        justify-center
        items-center
        bg-gray-100
      ">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Visit not found
          </h2>

          <button
            onClick={() => navigate("/app/visit")}
            className="
              mt-4
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-2
              rounded-lg
            "
          >
            Back to Visits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="
      min-h-screen
      bg-gray-100
      p-6
    ">
      <div className="
        max-w-4xl
        mx-auto
      ">

        {/* Header */}
        <div className="
          flex
          justify-between
          items-center
          mb-8
        ">

          <div>
            <h1 className="
              text-4xl
              font-bold
            ">
              Visit Details
            </h1>

            <p className="text-gray-500">
              Complete beneficiary visit information
            </p>
          </div>

          <button
            onClick={() => navigate("/app/visit")}
            className="
              bg-white
              px-5
              py-3
              rounded-xl
              shadow
              hover:bg-gray-50
            "
          >
            ← Back
          </button>

        </div>

        {/* Main Card */}
        <div className="
          bg-white
          rounded-3xl
          shadow-xl
          p-8
        ">

          {/* Visit Header */}
          <div className="
            flex
            justify-between
            mb-8
          ">

            <div>
              <h2 className="
                text-xl
                font-semibold
              ">
                Visit Information
              </h2>

              <p className="text-gray-500">
                ID : {selectedVisit.id}
              </p>
            </div>

            <span
              className={`
                px-4
                py-2
                rounded-full
                font-semibold
                ${statusStyle(selectedVisit.status)}
              `}
            >
              {selectedVisit.status}
            </span>

          </div>

          {/* Visit Information */}
          <div className="
            grid
            md:grid-cols-2
            gap-6
          ">


            {/* Beneficiary ID */}
            <div className="
              bg-gray-50
              p-5
              rounded-2xl
            ">
              <p className="text-gray-500">
                Beneficiary ID
              </p>

              <h3 className="text-lg font-bold">
                {selectedVisit.beneficiaryId}
              </h3>
            </div>

            {/* Visit Type */}
            <div className="
              bg-gray-50
              p-5
              rounded-2xl
            ">
              <p className="text-gray-500">
                Visit Type
              </p>

              <h3 className="text-lg font-bold">
                {selectedVisit.visitType}
              </h3>
            </div>

            {/* Notes */}
            <div className="
              bg-gray-50
              p-5
              rounded-2xl
              md:col-span-2
            ">
              <p className="text-gray-500">
                Notes
              </p>

              <p className="mt-3">
                {selectedVisit.notes || "No notes available"}
              </p>
            </div>

          </div>

          {/* Edit */}
          <div className="
            flex
            justify-end
            mt-8
          ">
            <button
              onClick={() =>
                navigate(
                  `/app/visit/edit/${selectedVisit.id}`
                )
              }
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-6
                py-3
                rounded-xl
              "
            >
              Edit Visit
            </button>
          </div>

        </div>

        {/* Medicine Follow-Up */}
        <MedicineFollowUpForm
          beneficiaryId={selectedVisit.beneficiaryId}
          visitId={selectedVisit.id}
        />

        <MedicineFollowUpHistory
          beneficiaryId={selectedVisit.beneficiaryId}
        />
      </div>
    </div>
  );
};

export default VisitDetail;