import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 relative">

      {/* Back Button */}
      <button
        type="button"
        onClick={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate("/register");
          }
        }}
        className="absolute top-6 left-6 hidden sm:inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
      >
        <ArrowRight className="h-4 w-4 rotate-180" />
        <span>Back</span>
      </button>

      <div className="bg-white p-8 rounded-xl shadow-md w-96">

        <h1 className="text-2xl font-bold text-center mb-6">
          Register
        </h1>

        {/* ANM Registration */}
        <Link
          to="/register/anm"
          className="block w-full bg-green-600 text-white text-center py-3 rounded-lg mb-4 hover:bg-green-700"
        >
          Register as ANM
        </Link>

        {/* ASHA Registration */}
        <Link
          to="/register/asha"
          className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700"
        >
          Register as ASHA
        </Link>

        <p className="mt-6 text-center">
          Already have an account?{" "}
          <Link
            className="text-blue-600 hover:underline"
            to="/login"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}