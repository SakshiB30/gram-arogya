import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import InventoryHeader from "../components/inventory/InventoryHeader";
import InventoryStats from "../components/inventory/InventoryStats";
import InventoryFilter from "../components/inventory/InventoryFilter";
import InventoryTable from "../components/inventory/InventoryTable";

import { getInventory } from "../redux/slices/inventorySlice";

export default function InventoryPage() {
  const dispatch = useDispatch();

  const {
    medicines = [],
    loading,
    error,
  } = useSelector((state) => state.inventory);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    dispatch(getInventory());
  }, [dispatch]);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const matchesSearch = medicine.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        medicine.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [medicines, searchTerm, statusFilter]);

  return (
    <div className="flex flex-col gap-6">

      <InventoryHeader />

      <InventoryStats medicines={medicines} />

      <InventoryFilter
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
      />

      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <InventoryTable
        medicines={filteredMedicines}
        loading={loading}
      />

    </div>
  );
}