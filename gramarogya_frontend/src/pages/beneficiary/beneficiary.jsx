import React from "react";
import { Users, User, Smile, ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../../redux/slices/beneficiarySlice";


const STATUS_STYLES = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-red-100 text-red-700",
  PENDING: "bg-yellow-100 text-yellow-700",
};

export default function Patients({ onOpenPatient = () => {} }) {
  const dispatch = useDispatch();

  const {
    beneficiaries,
    loading,
    error,
    } = useSelector((state) => state.beneficiaries);

  useEffect(() => {
    dispatch(fetchBeneficiaries());
  }, [dispatch]);

  if (loading) {
    return <p>Loading beneficiaries...</p>;
  } 

  if (error) {
    return <p>Error loading beneficiaries: {error}</p>;
  }

  const totalPatients = beneficiaries.length;

  const pregnantWomen = beneficiaries.filter(
    (b) => b.category === "PREGNANT_WOMAN"
    ).length;

  const children = beneficiaries.filter(
    (b) => b.category === "CHILD"
    ).length;

    const stats = [
  {
    label: "Total Patients",
    value: totalPatients,
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Pregnant Women",
    value: pregnantWomen,
    icon: User,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    label: "Children Under 5",
    value: children,
    icon: Smile,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
];


  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
        <p className="mt-1 text-slate-500">Overview of registered patients across all villages.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
  {stats.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
    <div
      key={label}
      className="rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div className="flex items-center justify-between">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}
        >
          <Icon size={22} className={iconColor} />
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  ))}
</div>

      {/* Beneficiary list table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">All Beneficiaries</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3 font-semibold">Beneficiary</th>
              <th className="px-6 py-3 font-semibold">Age / Gender</th>
              <th className="px-6 py-3 font-semibold">Village</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
  {beneficiaries?.map((p) => (
    <tr key={p.id} className="border-t border-slate-100">
      <td className="px-6 py-4">
  <p className="font-medium text-slate-900">
    {p.name}
  </p>

  <p className="text-xs text-slate-400">
    {p.phone}
  </p>
</td>

      <td className="px-6 py-4">
  {p.age} Yrs, {p.gender}
</td>

      <td className="px-6 py-4 text-slate-700">
        {p.village}
      </td>

      <td className="px-6 py-4">
        <span
  className={`rounded-full px-3 py-1 text-xs font-semibold ${
    STATUS_STYLES[p.status] ??
    "bg-gray-100 text-gray-700"
  }`}
>
  {p.status}
</span>
      </td>

      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onOpenPatient(p)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
        >
          View <ChevronRight size={14} />
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
}