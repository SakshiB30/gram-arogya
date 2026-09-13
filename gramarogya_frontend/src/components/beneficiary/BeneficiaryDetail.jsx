import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  Activity,
} from "lucide-react";

import {
  fetchBeneficiaryById,
  clearSelectedBeneficiary,
} from "../../redux/slices/beneficiarySlice";

export default function BeneficiaryDetail() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedBeneficiary,
    loading,
    error,
  } = useSelector((state) => state.beneficiaries);

  useEffect(() => {
    dispatch(fetchBeneficiaryById(id));

    return () => {
      dispatch(clearSelectedBeneficiary());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500">
        Loading beneficiary...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!selectedBeneficiary) {
    return (
      <div className="p-6 text-center">
        Beneficiary not found.
      </div>
    );
  }

  const beneficiary = selectedBeneficiary;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {beneficiary.name}
          </h1>

          <p className="mt-2 text-slate-500">
            Beneficiary Details
          </p>
        </div>
      </div>

      {/* Details Card */}
      <div className="rounded-xl border bg-white shadow-sm">

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
            p-6
          "
        >

          {/* Name */}
          <Info
            icon={<User size={18} />}
            label="Name"
            value={beneficiary.name}
          />

          {/* Age */}
          <Info
            icon={<Activity size={18} />}
            label="Age"
            value={
              beneficiary.age
                ? `${beneficiary.age} years`
                : "-"
            }
          />

          {/* Gender */}
          <Info
            icon={<User size={18} />}
            label="Gender"
            value={beneficiary.gender}
          />

          {/* Phone */}
          <Info
            icon={<Phone size={18} />}
            label="Phone"
            value={beneficiary.phone}
          />

          {/* Village */}
          <Info
            icon={<MapPin size={18} />}
            label="Village"
            value={beneficiary.village}
          />

          {/* Address */}
          <Info
            icon={<MapPin size={18} />}
            label="Address"
            value={beneficiary.address}
          />

          {/* Assigned ASHA */}
          <Info
            icon={<User size={18} />}
            label="Assigned ASHA"
            value={beneficiary.ashaName || "-"}
          />

          {/* Category */}
          <Info
            icon={<User size={18} />}
            label="Category"
            value={beneficiary.category}
          />

          {/* Disease */}
          <Info
            icon={<Activity size={18} />}
            label="Disease"
            value={beneficiary.disease}
          />

          {/* Status */}
          <Info
            icon={<Activity size={18} />}
            label="Status"
            value={beneficiary.status}
          />

          {/* Date Added */}
          <Info
            icon={<Calendar size={18} />}
            label="Date Added"
            value={beneficiary.dateAdded}
          />

          {/* Last Visit */}
          <Info
            icon={<Calendar size={18} />}
            label="Last Visit"
            value={beneficiary.lastVisitDate}
          />

          {/* Next Visit */}
          <Info
            icon={<Calendar size={18} />}
            label="Next Visit"
            value={beneficiary.nextVisitDate}
          />

        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/app/beneficiaries")}
        className="
          flex items-center gap-2
          rounded-lg
          border
          px-4 py-2
          hover:bg-slate-100
        "
      >
        <ArrowLeft size={18} />
        Back
      </button>

    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
        rounded-lg
        border
        p-4
      "
    >
      <div className="text-blue-600">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="font-semibold text-slate-900">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}