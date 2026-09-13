import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import {
  getErrorMessage,
  getErrorTitle,
} from "../utils/apiError";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ShieldPlus,
  Sparkles,
  ArrowRight,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
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

      {/* Login Form */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Decorative Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-1.5 text-sm font-semibold text-blue-700 border border-blue-200/50">
              <Sparkles className="h-4 w-4" />
              Staff Portal
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200/50 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-5 border-b border-slate-200/50">
              <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
              <p className="mt-1 text-sm text-slate-600">
                Sign in to access your GramArogya dashboard
              </p>
            </div>

            <div className="px-8 py-8">
              {error && (
                <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-semibold">
                      {getErrorTitle(error)}
                    </p>
                    <p className="mt-1">
                      {getErrorMessage(error)}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email Address
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
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your password"
                      required
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
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Create one now
                  </Link>
                </p>
              </div>

              {/* Security Badges */}
              <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1">🔒 Secure Login</span>
                <span className="flex items-center gap-1">🛡️ 2FA Ready</span>
                <span className="flex items-center gap-1">✅ SSL Encrypted</span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            This portal is intended for authorised ASHA, ANM and PHC staff only.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
