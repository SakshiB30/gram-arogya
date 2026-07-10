import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  SquarePen,
} from "lucide-react";

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">

    <div className="rounded-lg bg-green-100 p-3">
      <Icon size={20} className="text-green-700" />
    </div>

    <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <h3 className="mt-1 font-semibold text-gray-800">
        {value || "Not Available"}
      </h3>
    </div>

  </div>
);

const PersonalInfo = ({ profile, onEdit }) => {

  return (

    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b bg-green-50 px-6 py-4">

        <h2 className="text-xl font-semibold text-green-800">
          Personal Information
        </h2>

        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
        >
          <SquarePen size={16} />
          Edit Profile
        </button>

      </div>

      {/* Body */}

      <div className="grid gap-5 p-6 md:grid-cols-2">

        <InfoItem
          icon={User}
          label="Full Name"
          value={profile?.name}
        />

        <InfoItem
          icon={Mail}
          label="Email"
          value={profile?.email}
        />

        <InfoItem
          icon={Phone}
          label="Mobile Number"
          value={profile?.phone}
        />

        <InfoItem
          icon={Shield}
          label="Role"
          value={profile?.role}
        />

        <InfoItem
          icon={MapPin}
          label="Village"
          value={profile?.village}
        />

        <InfoItem
          icon={MapPin}
          label="Taluka"
          value={profile?.taluka}
        />

        <InfoItem
          icon={MapPin}
          label="District"
          value={profile?.district}
        />

        <InfoItem
          icon={MapPin}
          label="State"
          value={profile?.state}
        />

      </div>

    </div>

  );

};

export default PersonalInfo;