import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">
          Register
        </h1>

        <Link
          to="/register/anm"
          className="block w-full bg-green-600 text-white text-center py-3 rounded-lg mb-4 hover:bg-green-700"
        >
          Register as ANM
        </Link>

        <Link
          to="/register/asha"
          className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700"
        >
          Register as ASHA
        </Link>

        <p className="mt-6 text-center">
          Already have an account?{" "}
          <Link className="text-blue-600" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}