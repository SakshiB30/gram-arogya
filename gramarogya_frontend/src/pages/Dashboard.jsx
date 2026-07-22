import { useSelector } from "react-redux";

import AdminDashboard from "../components/dashboard/admin/AdminDashboard";
import AnmDashboard from "../components/dashboard/anm/AnmDashboard";
import AshaDashboard from "../components/dashboard/asha/AshaDashboard";

import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  switch (user?.role) {
    case "ADMIN":
      return <AdminDashboard />;

    case "ANM":
      return <AnmDashboard />;

    case "ASHA":
      return <AshaDashboard />;

    default:
  return <Navigate to="/unauthorized" replace />;
  }
}