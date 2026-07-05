import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useSelector } from "react-redux";
import MainLayout from "../layouts/MainLayout";
// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Main Pages
import Dashboard from "../pages/dashboard/Dashboard";
import Patients from "../pages/patients/Patients";
import DailyReport from "../pages/reports/DailyReport";
import MyReports from "../pages/reports/MyReports";
import VerifyReports from "../pages/verification/VerifyReports";
import MedicineInventory from "../pages/medicines/MedicineInventory";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {

  const { isAuthenticated } = useSelector((state) => state.auth);

  return (

    <BrowserRouter>
      <Routes>

        {/* Redirect root to login */}
        <Route path="/" element={ isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <Navigate to="/login" replace /> }/>

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="medicine-inventory" element={<MedicineInventory />} />
          <Route path="daily-report" element={<DailyReport />} />
          <Route path="my-reports" element={<MyReports />} />
          <Route path="verify-reports" element={<VerifyReports />} />
        </Route>

        {/* Invalid Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
