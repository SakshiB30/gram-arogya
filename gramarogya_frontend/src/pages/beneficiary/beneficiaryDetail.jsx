import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Phone,
  MapPin,
  Calendar,
  Activity,
} from "lucide-react";

import { fetchBeneficiaryById } from "../../redux/slices/beneficiarySlice";

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

        <div className="flex gap-3">

          <button
            onClick={() =>
              navigate(`/app/beneficiaries/edit/${beneficiary.id}`)
            }
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Edit size={18} />
            Edit
          </button>

          <button
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            <Trash2 size={18} />
            Delete
          </button>

        </div>

      </div>

      {/* Card */}

      <div className="rounded-xl border bg-white shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

          <Info
            icon={<User size={18} />}
            label="Name"
            value={beneficiary.name}
          />

          <Info
            icon={<Activity size={18} />}
            label="Age"
            value={beneficiary.age}
          />

          <Info
            icon={<User size={18} />}
            label="Gender"
            value={beneficiary.gender}
          />

          <Info
            icon={<Phone size={18} />}
            label="Phone"
            value={beneficiary.phone}
          />

          <Info
            icon={<MapPin size={18} />}
            label="Village"
            value={beneficiary.village}
          />

          <Info
            icon={<MapPin size={18} />}
            label="Address"
            value={beneficiary.address}
          />

          <Info
            icon={<User size={18} />}
            label="Category"
            value={beneficiary.category}
          />

          <Info
            icon={<Activity size={18} />}
            label="Disease"
            value={beneficiary.disease}
          />

          <Info
            icon={<Activity size={18} />}
            label="Status"
            value={beneficiary.status}
          />

          <Info
            icon={<Calendar size={18} />}
            label="Date Added"
            value={beneficiary.dateAdded}
          />

          <Info
            icon={<Calendar size={18} />}
            label="Last Visit"
            value={beneficiary.lastVisitDate}
          />

          <Info
            icon={<Calendar size={18} />}
            label="Next Visit"
            value={beneficiary.nextVisitDate}
          />

        </div>
      </div>

      <button
        onClick={() => navigate("/app/beneficiaries")}
        className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-slate-100"
      >
        <ArrowLeft size={18} />
        Back
      </button>

    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">

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