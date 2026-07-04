import React from "react";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Patients from "../pages/patients/Patients";
import DailyReport from "../pages/reports/DailyReport";
import MyReports from "../pages/reports/MyReports";
import VerifyReports from "../pages/verification/VerifyReports";
import MedicineInventory from "../pages/medicines/MedicineInventory";
import { BrowserRouter, Routes, Navigate, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* redirect root to /app */}
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

        {/* main layout */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="medicine-inventory" element={<MedicineInventory />} />
          <Route path="daily-report" element={<DailyReport />} />
          <Route path="my-reports" element={<MyReports />} />
          <Route path="verify-reports" element={<VerifyReports />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

