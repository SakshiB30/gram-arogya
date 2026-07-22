import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ShieldPlus,
  Landmark,
} from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

 useEffect(() => {
  if (!isAuthenticated || !user) return;

  navigate("/app/dashboard", { replace: true });
}, [isAuthenticated, user, navigate]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const fieldWrapClasses = (field) =>
    `flex items-center gap-2.5 rounded-sm border bg-white px-3 transition-colors ${
      focusedField === field
        ? "border-[#0B3558] ring-2 ring-[#0B3558]/15"
        : "border-slate-300"
    }`;

    const getErrorMessage = () => {
  switch (error) {
    case "Your account is pending verification.":
      return "Your registration is pending ANM approval.";

    case "Your registration has been rejected.":
      return "Your registration has been rejected. Please contact your ANM.";

    case "Your account has been blocked. Please contact your administrator.":
      return "Your account has been blocked by your ANM.";

    default:
      return error;
  }
};


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
                Staff Login
              </p>
              <span className="text-[11px] font-medium tracking-wide text-slate-400">
                Form No. GA&#8209;LOGIN&#8209;01
              </span>
            </div>

            <div className="px-6 py-7 sm:px-8">
              <div className="mb-6">
                <h1 className="font-serif text-xl font-bold text-slate-900">
                  Welcome back
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Sign in with your registered credentials to access the
                  portal.
                </p>
              </div>

              {error && (
                <div className="mb-5 flex items-start gap-2 border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{getErrorMessage()}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Email address
                  </label>
                  <div className={fieldWrapClasses("email")}>
                    <Mail className="h-4 w-4 shrink-0 text-slate-400" />
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
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs font-medium text-[#0B3558] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className={fieldWrapClasses("password")}>
                    <Lock className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      className="w-full bg-transparent py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="shrink-0 text-slate-400 hover:text-slate-600"
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#0B3558] py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#0d4173] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="font-semibold text-[#0B3558] hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
            This portal is intended for authorised ASHA, ANM and PHC staff
            use only. For access issues, contact your Block PHC
            coordinator.
          </p>
        </div>
      </main>

      
    </div>
  );
};

export default Login;