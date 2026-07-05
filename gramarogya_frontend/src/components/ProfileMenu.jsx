import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown } from "lucide-react";
import { logout } from "../redux/slices/authSlice";

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login", { replace: true });
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm hover:bg-gray-50"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
          <User size={18} />
        </div>

        <div className="hidden text-left md:block">
          <p className="text-sm font-semibold">
            {user?.name || "Guest"}
          </p>

          <p className="text-xs text-gray-500">
            {user?.role || ""}
          </p>
        </div>

        <ChevronDown size={18} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="border-b px-4 py-3">
            <p className="font-semibold">
              {user?.name}
            </p>

            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
          </div>

          <button
            className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-gray-100"
          >
            <User size={18} />
            My Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;