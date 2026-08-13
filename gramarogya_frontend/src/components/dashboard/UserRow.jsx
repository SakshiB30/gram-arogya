import { useDispatch } from "react-redux";

import {
  approveAnm,
  rejectAnm,
  blockAnm,
  unblockAnm,
  blockAsha,
  unblockAsha,
} from "../../redux/slices/adminSlice";


export default function UserRow({ user }) {

  const dispatch = useDispatch();


  const isAnm = user.role === "ANM";
  const isAsha = user.role === "ASHA";


  return (

    <tr className="border-b hover:bg-slate-50">

      {/* Name */}

      <td className="px-6 py-4">

        <div>

          <p className="font-semibold">
            {user.name}
          </p>

          <p className="text-sm text-slate-500">
            {user.email}
          </p>

        </div>

      </td>


      {/* Employee ID */}

      <td className="px-6 py-4">

        {user.employeeId || "-"}

      </td>


      {/* Role */}

      <td className="px-6 py-4">

        {isAnm ? (

          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            ANM
          </span>

        ) : (

          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            ASHA
          </span>

        )}

      </td>


      {/* Phone */}

      <td className="px-6 py-4">

        {user.phone || "-"}

      </td>


      {/* Verification */}

      <td className="px-6 py-4">

        {user.verificationStatus === "PENDING" && (

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            Pending
          </span>

        )}

        {user.verificationStatus === "APPROVED" && (

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Approved
          </span>

        )}

        {user.verificationStatus === "REJECTED" && (

          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Rejected
          </span>

        )}

      </td>


      {/* Account */}

      <td className="px-6 py-4">

        {user.accountStatus === "ACTIVE" ? (

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

          {/* ================= ANM ================= */}

          {isAnm &&
            user.verificationStatus === "PENDING" && (
              <>

                <button
                  onClick={() =>
                    dispatch(approveAnm(user.id))
                  }
                  className="rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    dispatch(rejectAnm(user.id))
                  }
                  className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                >
                  Reject
                </button>

              </>
            )}


          {/* ANM Active → Block */}

          {isAnm &&
            user.verificationStatus === "APPROVED" &&
            user.accountStatus === "ACTIVE" && (

              <button
                onClick={() =>
                  dispatch(blockAnm(user.id))
                }
                className="rounded bg-orange-500 px-3 py-2 text-white hover:bg-orange-600"
              >
                Block
              </button>

            )}


          {/* ANM Blocked → Unblock */}

          {isAnm &&
            user.verificationStatus === "APPROVED" &&
            user.accountStatus === "BLOCKED" && (

              <button
                onClick={() =>
                  dispatch(unblockAnm(user.id))
                }
                className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
              >
                Unblock
              </button>

            )}


          {/* ================= ASHA ================= */}

          {/* ASHA verification is done by ANM */}

          {isAsha &&
            user.verificationStatus === "APPROVED" &&
            user.accountStatus === "ACTIVE" && (

              <button
                onClick={() =>
                  dispatch(blockAsha(user.id))
                }
                className="rounded bg-orange-500 px-3 py-2 text-white hover:bg-orange-600"
              >
                Block
              </button>

            )}


          {isAsha &&
            user.verificationStatus === "APPROVED" &&
            user.accountStatus === "BLOCKED" && (

              <button
                onClick={() =>
                  dispatch(unblockAsha(user.id))
                }
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