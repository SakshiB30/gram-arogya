import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllUsers } from "../../../redux/slices/adminSlice";
import UserTable from "../UserTable";

export default function ManageUsers() {

  const dispatch = useDispatch();

  const {
    allUsers,
    loading,
    error,
  } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {

    dispatch(fetchAllUsers());

  }, [dispatch]);


  const filteredUsers = allUsers.filter((user) => {

    const name = (user.name || "").toLowerCase();

    const employeeId =
      (user.employeeId || "").toLowerCase();

    const phone =
      (user.phone || "").toLowerCase();

    const query = search.toLowerCase();


    const matchesSearch =
      name.includes(query) ||
      employeeId.includes(query) ||
      phone.includes(query);


    const matchesRole =
      roleFilter === "ALL" ||
      user.role === roleFilter;


    return matchesSearch && matchesRole;

  });


  if (error) {

    return (
      <div className="rounded-xl bg-red-100 p-5 text-red-600">
        {error}
      </div>
    );

  }


  return (

    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-2xl font-bold">
          Manage Users
        </h1>

        <p className="text-slate-500">
          View and manage all ANMs and ASHA workers
        </p>

      </div>


      {/* Filters */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        {/* Role filter */}

        <div className="flex gap-2">

          <button
            onClick={() => setRoleFilter("ALL")}
            className={`rounded-lg px-4 py-2 ${
              roleFilter === "ALL"
                ? "bg-violet-600 text-white"
                : "bg-white border"
            }`}
          >
            All
          </button>


          <button
            onClick={() => setRoleFilter("ANM")}
            className={`rounded-lg px-4 py-2 ${
              roleFilter === "ANM"
                ? "bg-violet-600 text-white"
                : "bg-white border"
            }`}
          >
            ANMs
          </button>


          <button
            onClick={() => setRoleFilter("ASHA")}
            className={`rounded-lg px-4 py-2 ${
              roleFilter === "ASHA"
                ? "bg-violet-600 text-white"
                : "bg-white border"
            }`}
          >
            ASHAs
          </button>

        </div>


        {/* Search */}

        <input
          type="text"
          placeholder="Search by name, employee ID or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border px-4 py-2 md:w-80"
        />

      </div>


      {/* Table */}

      <UserTable
        users={filteredUsers}
        loading={loading}
      />

    </div>

  );
}