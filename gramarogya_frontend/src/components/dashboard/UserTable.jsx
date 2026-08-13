import UserRow from "./UserRow";

export default function UserTable({ users, loading }) {

  if (loading) {

    return (
      <div className="rounded-xl bg-white p-10 text-center">
        Loading users...
      </div>
    );

  }


  if (users.length === 0) {

    return (
      <div className="rounded-xl bg-white p-10 text-center text-slate-500">
        No users found.
      </div>
    );

  }


  return (

    <div className="overflow-hidden rounded-xl bg-white shadow">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-6 py-4 text-left">
                Name
              </th>

              <th className="px-6 py-4 text-left">
                Employee ID
              </th>

              <th className="px-6 py-4 text-left">
                Role
              </th>

              <th className="px-6 py-4 text-left">
                Phone
              </th>

              <th className="px-6 py-4 text-left">
                Verification
              </th>

              <th className="px-6 py-4 text-left">
                Account
              </th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {users.map((user) => (

              <UserRow
                key={user.id}
                user={user}
              />

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}