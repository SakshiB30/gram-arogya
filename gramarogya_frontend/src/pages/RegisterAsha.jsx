import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAsha, clearError } from "../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  ShieldPlus,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const RegisterAsha = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  phone: "",
  village: "",
  taluka: "",
  district: "",
  state: "",
  anmEmployeeId: "",
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

    const result = await dispatch(registerAsha(formData));

    if (registerAsha.fulfilled.match(result)) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-200 transition-all duration-300 group-hover:scale-105">
              <ShieldPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">GramArogya</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Rural Healthcare Management
              </p>
            </div>
          </Link>

       <button
  type="button"
  onClick={() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/register");
    }
  }}
  className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
>
  <ArrowRight className="h-4 w-4 rotate-180" />
  <span>Back</span>
</button>
        </div>
      </header>

      {/* Register Form */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Decorative Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 px-4 py-1.5 text-sm font-semibold text-emerald-700 border border-emerald-200/50">
              <Sparkles className="h-4 w-4" />
              Register as ASHA Worker
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200/50 overflow-hidden">
            {/* Card Header */}
            <div className="bg-linear-to-r from-emerald-50 to-blue-50 px-8 py-5 border-b border-slate-200/50">
              <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
              <p className="mt-1 text-sm text-slate-600">
                Register as Accredited Social Health Activist (ASHA)
              </p>
            </div>

            <div className="px-8 py-8">
              {error && (
                <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {showSuccess && (
                <div className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 animate-fadeIn">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>
                    Registration submitted successfully!

Your request has been sent to your ANM.

After the assigned ANM approves your account,
you will be able to log in.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your full name"
                      required
                      className={`w-full rounded-xl border-2 bg-slate-50/50 pl-12 pr-4 py-3.5 text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none ${
                        focusedField === "name"
                          ? "border-blue-500 bg-white ring-4 ring-blue-500/10"
                          : "border-slate-200"
                      }`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@example.com"
                      required
                      className={`w-full rounded-xl border-2 bg-slate-50/50 pl-12 pr-4 py-3.5 text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none ${
                        focusedField === "email"
                          ? "border-blue-500 bg-white ring-4 ring-blue-500/10"
                          : "border-slate-200"
                      }`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Create a strong password"
                      required
                      minLength="6"
                      className={`w-full rounded-xl border-2 bg-slate-50/50 pl-12 pr-12 py-3.5 text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none ${
                        focusedField === "password"
                          ? "border-blue-500 bg-white ring-4 ring-blue-500/10"
                          : "border-slate-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Minimum 6 characters
                  </p>
                </div>

                <div>
  <label className="mb-1.5 block text-sm font-medium text-slate-700">
    ANM Employee ID <span className="text-red-500">*</span>
  </label>

  <input
    type="text"
    name="anmEmployeeId"
    value={formData.anmEmployeeId}
    onChange={handleChange}
    placeholder="Enter your ANM Employee ID (e.g. ANM001)"
    required
    className="w-full rounded-xl border-2 bg-slate-50 pl-4 py-3"
  />
</div>

                <div>
  <label className="mb-1.5 block text-sm font-medium text-slate-700">
    Phone Number
  </label>

  <div className="relative">

    <input
      type="text"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      placeholder="9876543210"
      className="w-full rounded-xl border-2 bg-slate-50 pl-4 py-3"
    />

  </div>
</div>

                  <div>
  <label className="mb-1.5 block text-sm font-medium text-slate-700">
    Village
  </label>

  <input
    type="text"
    name="village"
    value={formData.village}
    onChange={handleChange}
    placeholder="Village"
    className="w-full rounded-xl border-2 bg-slate-50 pl-4 py-3"
  />
</div>

<div>
  <label className="mb-1.5 block text-sm font-medium text-slate-700">
    Taluka
  </label>

  <input
    type="text"
    name="taluka"
    value={formData.taluka}
    onChange={handleChange}
    placeholder="Taluka"
    className="w-full rounded-xl border-2 bg-slate-50 pl-4 py-3"
  />
</div> 

<div>
  <label className="mb-1.5 block text-sm font-medium text-slate-700">
    District
  </label>

  <input
    type="text"
    name="district"
    value={formData.district}
    onChange={handleChange}
    placeholder="District"
    className="w-full rounded-xl border-2 bg-slate-50 pl-4 py-3"
  />
</div> 

<div>
  <label className="mb-1.5 block text-sm font-medium text-slate-700">
    State
  </label>

  <input
    type="text"
    name="state"
    value={formData.state}
    onChange={handleChange}
    placeholder="State"
    className="w-full rounded-xl border-2 bg-slate-50 pl-4 py-3"
  />
</div> 

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading || showSuccess}
                  className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Info Badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
    <span>👩‍⚕️ Linked with ANM</span>
    <span>🔒 Secure Registration</span>
    <span>✅ ANM Verification</span>
</div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 leading-relaxed">
           Your registration request will be reviewed by your assigned ANM. Once approved, your account will become active.
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterAsha;
