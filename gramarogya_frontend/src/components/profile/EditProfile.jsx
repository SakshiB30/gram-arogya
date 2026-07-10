import { useEffect, useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Save,
  X,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../redux/slices/profileSlice";

const EditProfile = ({ profile, onCancel, onSuccess }) => {

  const dispatch = useDispatch();

  const { loading } = useSelector(
    state => state.profile
  );

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    village: "",
    taluka: "",
    district: "",
    state: "",
    profileImage: "",
  });

  useEffect(() => {

    if(profile){

      setFormData({

        name: profile.name || "",

        phone: profile.phone || "",

        village: profile.village || "",

        taluka: profile.taluka || "",

        district: profile.district || "",

        state: profile.state || "",

        profileImage: profile.profileImage || ""

      });

    }

  }, [profile]);

  const handleChange = (e) => {

    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const result = await dispatch(
      updateProfile(formData)
    );

    if(updateProfile.fulfilled.match(result)){
      onSuccess();
    }

  };

  return (

    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white shadow-sm"
    >

      <div className="border-b bg-green-50 px-6 py-4">

        <h2 className="text-xl font-semibold text-green-800">
          Edit Profile
        </h2>

      </div>

      <div className="grid gap-5 p-6 md:grid-cols-2">

        {/* Name */}

        <div>

          <label className="mb-2 block font-medium">
            Full Name
          </label>

          <div className="flex items-center rounded-xl border px-3">

            <User
              className="text-gray-400"
              size={18}
            />

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 outline-none"
            />

          </div>

        </div>

        {/* Phone */}

        <div>

          <label className="mb-2 block font-medium">
            Phone
          </label>

          <div className="flex items-center rounded-xl border px-3">

            <Phone
              className="text-gray-400"
              size={18}
            />

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 outline-none"
            />

          </div>

        </div>

        {/* Village */}

        <div>

          <label className="mb-2 block font-medium">
            Village
          </label>

          <div className="flex items-center rounded-xl border px-3">

            <MapPin
              className="text-gray-400"
              size={18}
            />

            <input
              type="text"
              name="village"
              value={formData.village}
              onChange={handleChange}
              className="w-full p-3 outline-none"
            />

          </div>

        </div>

        {/* Taluka */}

        <div>

          <label className="mb-2 block font-medium">
            Taluka
          </label>

          <input
            type="text"
            name="taluka"
            value={formData.taluka}
            onChange={handleChange}
            className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
          />

        </div>

        {/* District */}

        <div>

          <label className="mb-2 block font-medium">
            District
          </label>

          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
          />

        </div>

        {/* State */}

        <div>

          <label className="mb-2 block font-medium">
            State
          </label>

          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
          />

        </div>

      </div>

      <div className="flex justify-end gap-3 border-t bg-gray-50 p-6">

        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 rounded-lg border px-5 py-2"
        >
          <X size={18} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2 text-white hover:bg-green-800"
        >
          <Save size={18} />

          {loading ? "Saving..." : "Save Changes"}

        </button>

      </div>

    </form>

  );

};

export default EditProfile;