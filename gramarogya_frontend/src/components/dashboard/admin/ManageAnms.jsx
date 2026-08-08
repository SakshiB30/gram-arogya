import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllAnms,
} from "../../../redux/slices/adminSlice";

import AnmTable from "../anm/AnmTable";

export default function ManageAnms() {

  const dispatch = useDispatch();

  const {
    allAnms,
    loading,
  } = useSelector(state => state.admin);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllAnms());
  }, [dispatch]);

  const filteredAnms = allAnms.filter(anm =>
      anm.name.toLowerCase().includes(search.toLowerCase()) ||
      (anm.employeeId || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (

    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold">
            Manage ANMs
          </h1>

          <p className="text-slate-500">
            View and manage all registered ANMs
          </p>

        </div>

        <input
          type="text"
          placeholder="Search ANM..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="rounded-lg border px-4 py-2"
        />

      </div>

      <AnmTable
        anms={filteredAnms}
        loading={loading}
      />

    </div>

  );

}