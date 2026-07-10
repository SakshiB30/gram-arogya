import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Stethoscope,
  Loader2,
  AlertCircle,
  ChevronDown,
  ShieldPlus,
  Landmark,
} from "lucide-react";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ASHA",
  });

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      alert("Registration Successful!");
      navigate("/login");
    }
  };

  const fieldWrapClasses = (field) =>
    `flex items-center gap-2.5 rounded-sm border bg-white px-3 transition-colors ${
      focusedField === field
        ? "border-[#0B3558] ring-2 ring-[#0B3558]/15"
        : "border-slate-300"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-[#EEF1F4]">

      {/* Official header bar */}
      <header className="w-full border-b border-slate-200 bg-[#0B3558]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/25 bg-white/10">
              <ShieldPlus className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div className="leading-tight">
              <p className="font-serif text-[1.05rem] font-bold tracking-wide text-white">
                GramArogya
              </p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-300">
                Rural Primary Healthcare Management System
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-3 py-1.5 sm:flex">
            <Landmark className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-200">
              ASHA &middot; ANM &middot; PHC Staff Portal
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="border border-slate-300 bg-white shadow-sm">
            {/* Card header strip */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3">
              <p className="text-sm font-semibold text-[#0B3558]">
                Staff Registration
              </p>
              <span className="text-[11px] font-medium tracking-wide text-slate-400">
                Form No. GA&#8209;REG&#8209;01
              </span>
            </div>

            <div className="px-6 py-7 sm:px-8">
              <div className="mb-6">
                <h1 className="font-serif text-xl font-bold text-slate-900">
                  Create your account
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Register as an ASHA, ANM or PHC administrator to get
                  started.
                </p>
              </div>

              {error && (
                <div className="mb-5 flex items-start gap-2 border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Full name
                  </label>
                  <div className={fieldWrapClasses("name")}>
                    <User className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your name"
                      className="w-full bg-transparent py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Email address
                  </label>
                  <div className={fieldWrapClasses("email")}>
                    <Mail className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Password
                  </label>
                  <div className={fieldWrapClasses("password")}>
                    <Lock className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Create a password"
                      className="w-full bg-transparent py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="flex-shrink-0 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Role
                  </label>
                  <div className={fieldWrapClasses("role") + " relative"}>
                    <Stethoscope className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("role")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full appearance-none bg-transparent py-2.5 text-sm text-slate-900 outline-none [&>option]:bg-white"
                    >
                      <option value="ASHA">ASHA</option>
                      <option value="ANM">ANM</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#0B3558] py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#0d4173] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#0B3558] hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
            Registration is limited to authorised ASHA, ANM and PHC staff.
            Submissions are subject to verification by your Block PHC
            office.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;