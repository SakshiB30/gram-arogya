import { useDispatch } from "react-redux";
import {
  approveAnm,
  rejectAnm,
  blockAnm,
  unblockAnm,
} from "../../../redux/slices/adminSlice";

export default function AnmRow({ anm }) {
  const dispatch = useDispatch();

  const handleBlock = () => {
    if (window.confirm(`Block ${anm.name}?`)) {
        dispatch(blockAnm(anm.id));
    }
};

const handleReject = () => {
    if (window.confirm(`Reject ${anm.name}'s registration?`)) {
        dispatch(rejectAnm(anm.id));
    }
};

  return (
    <tr className="border-b hover:bg-slate-50">

      {/* Name */}
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold">{anm.name}</p>
          <p className="text-sm text-slate-500">
            {anm.email}
          </p>
        </div>
      </td>

      {/* Employee ID */}
      <td className="px-6 py-4">
        {anm.employeeId || "-"}
      </td>

      {/* Phone */}
      <td className="px-6 py-4">
        {anm.phone || "-"}
      </td>

      {/* Verification */}
      <td className="px-6 py-4">

        {anm.verificationStatus === "PENDING" && (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            Pending
          </span>
        )}

        {anm.verificationStatus === "APPROVED" && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Approved
          </span>
        )}

        {anm.verificationStatus === "REJECTED" && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Rejected
          </span>
        )}

      </td>

      {/* Account */}
      <td className="px-6 py-4">

        {anm.accountStatus === "ACTIVE" ? (

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Active
          </span>

        ) : (

          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Blocked
          </span>

        )}

      </td>

      {/* Actions */}
      <td className="px-6 py-4">

        <div className="flex justify-center gap-2">

          {/* Pending → Approve + Reject */}

          {anm.verificationStatus === "PENDING" && (
            <>
              <button
                onClick={() => dispatch(approveAnm(anm.id))}
                className="rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
              >
                Approve
              </button>

              <button
                onClick={handleReject}
                className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
              >
                Reject
              </button>
            </>
          )}

          {/* Approved + Active → Block */}

          {anm.verificationStatus === "APPROVED" &&
            anm.accountStatus === "ACTIVE" && (
              <button
                onClick={handleBlock}
                className="rounded bg-orange-500 px-3 py-2 text-white hover:bg-orange-600"
              >
                Block
              </button>
            )}

          {/* Approved + Blocked → Unblock */}

          {anm.verificationStatus === "APPROVED" &&
            anm.accountStatus === "BLOCKED" && (
              <button
                onClick={() => dispatch(unblockAnm(anm.id))}
                className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
              >
                Unblock
              </button>
            )}

        </div>

      </td>

    </tr>
  );
}