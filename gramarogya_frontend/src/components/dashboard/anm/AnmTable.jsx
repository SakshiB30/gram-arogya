import AnmRow from "./AnmRow";

export default function AnmTable({ anms, loading }) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-10 text-center">
        Loading...
      </div>
    );
  }

  if (anms.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center text-slate-500">
        No ANMs found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-6 py-4 text-left">Name</th>

            <th className="px-6 py-4 text-left">Employee ID</th>

            <th className="px-6 py-4 text-left">Phone</th>

            <th className="px-6 py-4 text-left">Verification</th>

            <th className="px-6 py-4 text-left">Account</th>

            <th className="px-6 py-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {anms.map((anm) => (
            <AnmRow
              key={anm.id}
              anm={anm}
            />
          ))}

        </tbody>

      </table>

    </div>
  );
}