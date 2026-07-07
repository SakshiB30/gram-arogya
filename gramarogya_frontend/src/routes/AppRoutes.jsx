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
import Beneficiary from "../pages/beneficiary/Beneficiary";
import DailyReport from "../pages/reports/DailyReport";
import MyReports from "../pages/reports/MyReports";
import VerifyReports from "../pages/verification/VerifyReports";
import MedicineInventory from "../pages/medicines/MedicineInventory";
import ProtectedRoute from "./ProtectedRoute";
import BeneficiaryDetail from "../pages/beneficiary/beneficiaryDetail";
import AddBeneficiary from "../pages/beneficiary/AddBeneficiary";
import EditBeneficiary from "../pages/beneficiary/EditBeneficiary";
import Visit from "../pages/visit/Visit";
import AddVisit from "../pages/visit/AddVisit";
import EditVisit from "../pages/visit/EditVisit";
import VisitDetail from "../pages/visit/VisitDetail";

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
          <Route path="beneficiary" element={<Beneficiary />} />
          <Route path="medicine-inventory" element={<MedicineInventory />} />
          <Route path="daily-report" element={<DailyReport />} />
          <Route path="my-reports" element={<MyReports />} />
          <Route path="verify-reports" element={<VerifyReports />} />
          <Route path="beneficiaries/:id" element={<BeneficiaryDetail />}/>
          <Route path="beneficiaries/add" element={<AddBeneficiary />} />
          <Route path="beneficiaries/edit/:id" element={<EditBeneficiary />} />
          <Route path="visit" element={<Visit />} />
          <Route path="visit/add" element={<AddVisit />} />
          <Route path="visit/edit/:id" element={<EditVisit />} />
          <Route path="visit/:id" element={<VisitDetail />} />
        </Route>

        {/* Invalid Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
