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

  // Redirect after successful login
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    switch (user.role) {
      case "ADMIN":
      case "ANM":
      case "ASHA":
        navigate("/app/dashboard", { replace: true });
        break;

      default:
        navigate("/unauthorized", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Clear error when component unmounts
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
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-[#0B3558]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/25 bg-white/10">
              <ShieldPlus className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="font-serif text-lg font-bold text-white">
                GramArogya
              </p>

              <p className="text-[11px] uppercase tracking-wider text-slate-300">
                Rural Primary Healthcare Management System
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-3 py-1.5 sm:flex">
            <Landmark className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-[11px] uppercase tracking-wider text-slate-200">
              ASHA · ANM · PHC Staff Portal
            </span>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="border border-slate-300 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3">
              <p className="text-sm font-semibold text-[#0B3558]">
                Staff Login
              </p>

              <span className="text-[11px] text-slate-400">
                Form No. GA-LOGIN-01
              </span>
            </div>

            <div className="px-6 py-7 sm:px-8">
              <div className="mb-6">
                <h1 className="font-serif text-xl font-bold text-slate-900">
                  Welcome Back
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Sign in using your registered credentials.
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
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Email Address
                  </label>

                  <div className={fieldWrapClasses("email")}>
                    <Mail className="h-4 w-4 text-slate-400" />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-transparent py-2.5 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-medium text-[#0B3558]"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className={fieldWrapClasses("password")}>
                    <Lock className="h-4 w-4 text-slate-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-transparent py-2.5 text-sm outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#0B3558] py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#0d4173] disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
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

          <p className="mt-4 text-center text-xs text-slate-500">
            This portal is intended for authorised ASHA, ANM and PHC staff only.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;