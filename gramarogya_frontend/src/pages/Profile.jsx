import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProfileCard from "../components/profile/ProfileCard";
import PersonalInfo from "../components/profile/PersonalInfo";
import EditProfile from "../components/profile/EditProfile";

import { fetchProfile } from "../redux/slices/profileSlice";

export default function Profile() {

  const dispatch = useDispatch();

  const { profile, loading, error } = useSelector(
    (state) => state.profile
  );

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (loading && !profile) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-100 p-5 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Profile Header */}
      <ProfileCard profile={profile} />

      {/* View / Edit */}
      {editing ? (
        <EditProfile
          profile={profile}
          onCancel={() => setEditing(false)}
          onSuccess={() => {
            dispatch(fetchProfile());
            setEditing(false);
          }}
        />
      ) : (
        <PersonalInfo
          profile={profile}
          onEdit={() => setEditing(true)}
        />
      )}

    </div>
  );
}