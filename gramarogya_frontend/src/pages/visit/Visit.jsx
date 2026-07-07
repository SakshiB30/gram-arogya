import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchVisits,
  deleteVisit,
} from "../../redux/slices/visitSlice";

const Visit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { visits, loading, error } = useSelector(
    (state) => state.visit
  );

  useEffect(() => {
    dispatch(fetchVisits());
  }, [dispatch]);

  const getStatusColor = (status) => {
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

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this visit?"
  );

  if (!confirmDelete) return;

  try {
    await dispatch(deleteVisit(id)).unwrap();
    dispatch(fetchVisits());
  } catch (err) {
    alert(err);
  }
};
    

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Visits
          </h1>
          <p className="text-gray-500 mt-1">
            Manage beneficiary visit records
          </p>
        </div>

        <button
          onClick={() => navigate("/app/visit/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          + New Visit
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="p-6">
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && visits.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-700">
              No Visits Found
            </h2>

            <p className="text-gray-500 mt-2">
              Create your first visit to get started.
            </p>

            <button
              onClick={() => navigate("/app/visit/add")}
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Add Visit
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && visits.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    #
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Beneficiary ID
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Visit Type
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Notes
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {visits.map((visit, index) => (
                  <tr
                    key={visit.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {visit.beneficiaryId}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {visit.visitType}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          visit.status
                        )}`}
                      >
                        {visit.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {visit.notes || "-"}
                    </td>

                    <td className="px-6 py-4 text-center">
  <div className="flex justify-center gap-2">

    {/* View */}
    <button
      onClick={() => navigate(`/app/visit/${visit.id}`)}
      className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
    >
      View
    </button>


    {/* Edit */}
    <button
      onClick={() => navigate(`/app/visit/edit/${visit.id}`)}
      className="px-4 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
    >
      Edit
    </button>


    {/* Delete */}
    <button
      onClick={() => handleDelete(visit.id)}
      className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
    >
      Delete
    </button>

  </div>
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

export default Visit;