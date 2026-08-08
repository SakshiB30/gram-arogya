import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingAnms,
  approveAnm,
} from "../redux/slices/adminSlice";

const AdminPage = () => {
  const dispatch = useDispatch();

  const {
    pendingAnms,
    loading,
    error,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchPendingAnms());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveAnm(id));
  };

  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Pending ANM Approvals
        </h1>

        <p className="text-gray-500">
          Review and approve newly registered ANMs.
        </p>
      </div>

      {loading && (
        <p>Loading...</p>
      )}

      {error && (
        <p className="text-red-600">
          {error}
        </p>
      )}

      {!loading && pendingAnms.length === 0 && (
        <div className="rounded-lg border bg-white p-10 text-center">
          <h2 className="text-lg font-semibold">
            No Pending ANMs
          </h2>

          <p className="mt-2 text-gray-500">
            Every registered ANM has been approved.
          </p>
        </div>
      )}

      {pendingAnms.length > 0 && (
        <div className="overflow-hidden rounded-lg border bg-white shadow">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-6 py-3 text-left">
                  Name
                </th>

                <th className="px-6 py-3 text-left">
                  Email
                </th>

                <th className="px-6 py-3 text-left">
                  Status
                </th>

                <th className="px-6 py-3 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {pendingAnms.map((anm) => (

                <tr
                  key={anm.id}
                  className="border-t"
                >

                  <td className="px-6 py-4">
                    {anm.name}
                  </td>

                  <td className="px-6 py-4">
                    {anm.email}
                  </td>

                  <td className="px-6 py-4">

                    <span className="rounded bg-yellow-100 px-3 py-1 text-sm text-yellow-700">

                      Pending

                    </span>

                  </td>

                  <td className="px-6 py-4 text-center">

                    <button
                      onClick={() => handleApprove(anm.id)}
                      className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                      Approve
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default AdminPage;