import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchVisitById } from "../../redux/slices/visitSlice";

const VisitDetail = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedVisit, loading, error } = useSelector(
    (state) => state.visit
  );


  useEffect(() => {
    dispatch(fetchVisitById(id));
  }, [dispatch, id]);


  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";

      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="m-6 bg-red-100 text-red-700 p-4 rounded-xl">
        {error}
      </div>
    );
  }


  if (!selectedVisit) return null;



  return (

    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 p-6">


      <div className="max-w-4xl mx-auto">


        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Visit Details
            </h1>

            <p className="text-gray-500 mt-2">
              Complete information about beneficiary visit
            </p>
          </div>


          <button
            onClick={() => navigate("/app/visit")}
            className="
              px-5 py-2.5 
              bg-white 
              shadow 
              rounded-xl
              text-gray-700
              hover:bg-gray-100
              transition
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
          border border-gray-100
        ">



          {/* Top Section */}

          <div className="flex items-center justify-between mb-8">


            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                Visit Information
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Visit ID : {selectedVisit.id}
              </p>

            </div>



            <span
              className={`
                px-4 py-2 
                rounded-full 
                text-sm 
                font-semibold
                border
                ${getStatusStyle(selectedVisit.status)}
              `}
            >
              {selectedVisit.status}
            </span>


          </div>





          {/* Details Grid */}

          <div className="
            grid 
            md:grid-cols-2 
            gap-6
          ">



            <div className="bg-gray-50 rounded-2xl p-5">

              <p className="text-sm text-gray-500">
                Beneficiary ID
              </p>

              <h3 className="mt-2 text-lg font-semibold text-gray-800">
                {selectedVisit.beneficiaryId}
              </h3>

            </div>





            <div className="bg-gray-50 rounded-2xl p-5">

              <p className="text-sm text-gray-500">
                Visit Type
              </p>

              <h3 className="mt-2 text-lg font-semibold text-gray-800">
                {selectedVisit.visitType}
              </h3>

            </div>





            <div className="bg-gray-50 rounded-2xl p-5 md:col-span-2">

              <p className="text-sm text-gray-500">
                Notes
              </p>

              <p className="mt-3 text-gray-700 leading-relaxed">
                {selectedVisit.notes || "No notes available"}
              </p>

            </div>



          </div>




          {/* Footer Actions */}

          <div className="mt-8 flex justify-end gap-3">


            <button
              onClick={() =>
                navigate(`/app/visit/edit/${selectedVisit.id}`)
              }
              className="
                px-6 py-3
                bg-blue-600
                hover:bg-blue-700
                text-white
                rounded-xl
                shadow
                transition
              "
            >
              Edit Visit
            </button>


          </div>


        </div>


      </div>


    </div>

  );
};


export default VisitDetail;