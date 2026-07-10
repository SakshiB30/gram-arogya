import { UserCircle } from "lucide-react";

const ProfileCard = ({ profile }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 px-8 py-10">

        <div className="flex items-center gap-6">

          {/* Avatar */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white text-4xl font-bold text-green-700 shadow">

            {profile?.name
              ? profile.name.charAt(0).toUpperCase()
              : <UserCircle size={60} />}

          </div>

          {/* User Info */}
          <div className="text-white">

            <h1 className="text-3xl font-bold">
              {profile?.name || "User"}
            </h1>

            <p className="mt-1 text-green-100">
              {profile?.email}
            </p>

            <span className="mt-3 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
              {profile?.role}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfileCard;