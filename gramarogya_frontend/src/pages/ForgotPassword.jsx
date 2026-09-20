import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
} from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();

    setMessage("");

    const result = await dispatch(sendForgotPasswordOtp(email));

    if (sendForgotPasswordOtp.fulfilled.match(result)) {
      setStep(2);
      setMessage("OTP sent successfully.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setMessage("");

    const result = await dispatch(
      verifyForgotPasswordOtp({
        email,
        code,
      })
    );

    if (verifyForgotPasswordOtp.fulfilled.match(result)) {
      setResetToken(result.payload.message);
      setStep(3);
      setMessage("OTP verified successfully.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const result = await dispatch(
      resetPassword({
        resetToken,
        newPassword,
      })
    );

    if (resetPassword.fulfilled.match(result)) {
      setMessage(result.payload.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <h1 className="text-2xl font-bold text-slate-900">
          Forgot Password
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {step === 1 && "Enter your registered email address."}
          {step === 2 && "Enter the OTP sent to your email."}
          {step === 3 && "Create a new password."}
        </p>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {typeof error === "string"
              ? error
              : error?.message || "Something went wrong."}
          </div>
        )}

        {/* Success / Information */}
        {message && (
          <div className="mt-5 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        {/* STEP 1 — EMAIL */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

          </form>
        )}

        {/* STEP 2 — OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                OTP
              </label>

              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter OTP"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

          </form>
        )}

        {/* STEP 3 — NEW PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

          </form>
        )}

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-6 w-full text-center text-sm font-medium text-blue-600 hover:underline"
        >
          Back to Login
        </button>

      </div>
    </div>
  );
};

export default ForgotPassword;