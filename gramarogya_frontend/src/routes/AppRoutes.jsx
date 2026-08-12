import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useSelector } from "react-redux";

import MainLayout from "../layouts/MainLayout";

// Auth
import Login from "../pages/Login";
import Register from "../pages/Register";
import RegisterAnm from "../pages/RegisterAnm";
import RegisterAsha from "../pages/RegisterAsha";
import Unauthorized from "../pages/Unauthorized";

// Dashboard
import Dashboard from "../pages/Dashboard";

// Profile
import Profile from "../pages/Profile";

// Beneficiary
import BeneficiaryPage from "../pages/BeneficiaryPage";
import BeneficiaryDetail from "../components/beneficiary/BeneficiaryDetail";
import AddBeneficiary from "../components/beneficiary/AddBeneficiary";
import EditBeneficiary from "../components/beneficiary/EditBeneficiary";

// Reports
import ReportsPage from "../pages/ReportsPage";

// Medicine
import InventoryPage from "../pages/InventoryPage";
import AddMedicine from "../components/inventory/AddMedicine";
import EditMedicine from "../components/inventory/EditMedicine";
import ReceiveMedicine from "../components/inventory/ReceiveMedicine";
import MedicineDetail from "../components/inventory/MedicineDetail";

// Visit
import VisitPage from "../pages/VisitPage";
import AddVisit from "../components/visit/AddVisit";
import EditVisit from "../components/visit/EditVisit";
import VisitDetail from "../components/visit/VisitDetail";

// Health Records
import HealthRecordsPage from "../pages/HealthRecordsPage";
import HealthRecordList from "../components/healthRecords/HealthRecordList";
import AddHealthRecord from "../components/healthRecords/AddHealthRecord";
import EditHealthRecord from "../components/healthRecords/EditHealthRecord";
import HealthRecordDetail from "../components/healthRecords/HealthRecordDetail";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// Landing Page
import LandingPage from "../pages/LandingPage";

import MedicineStockHistory from "../components/inventory/MedicineStockHistory";
import ManageAnms from "../components/dashboard/admin/ManageAnms";

import IssueMedicine from "../components/inventory/IssueMedicine";

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Root - Landing Page for unauthenticated users */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <LandingPage />
            )
          }
        />
{/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/app/dashboard" replace />
              : <Login />
          }
        />

         {/* Register Selection */}
        <Route
          path="/register"
          element={
            isAuthenticated
              ? <Navigate to="/app/dashboard" replace />
              : <Register />
          }
        />

        {/* Register ANM */}
        <Route
          path="/register/anm"
          element={
            isAuthenticated
              ? <Navigate to="/app/dashboard" replace />
              : <RegisterAnm />
          }
        />

        {/* Register ASHA */}
        <Route
          path="/register/asha"
          element={
            isAuthenticated
              ? <Navigate to="/app/dashboard" replace />
              : <RegisterAsha />
          }
        />

        

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected App Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Default */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route
  path="app/admin/manage-anms"
  element={
    <RoleRoute allowedRoles={["ADMIN"]}>
      <ManageAnms />
    </RoleRoute>
  }
/>

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                <Dashboard />
              </RoleRoute>
            }
          />

          {/* Profile */}
          <Route
            path="profile"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                <Profile />
              </RoleRoute>
            }
          />

          {/* ================= BENEFICIARIES ================= */}
          <Route
            path="beneficiaries"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                <BeneficiaryPage />
              </RoleRoute>
            }
          />

          <Route
            path="beneficiaries/add"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                <AddBeneficiary />
              </RoleRoute>
            }
          />

          <Route
            path="beneficiaries/:id"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                <BeneficiaryDetail />
              </RoleRoute>
            }
          />

          <Route
            path="beneficiaries/edit/:id"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                <EditBeneficiary />
              </RoleRoute>
            }
          />

          {/* ================= VISITS ================= */}
          <Route
            path="visit"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                <VisitPage />
              </RoleRoute>
            }
          />

          <Route
            path="visit/add"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                <AddVisit />
              </RoleRoute>
            }
          />

          <Route
            path="visit/:id"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                <VisitDetail />
              </RoleRoute>
            }
          />

          <Route
            path="visit/edit/:id"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                <EditVisit />
              </RoleRoute>
            }
          />

          {/* ================= INVENTORY ================= */}
          <Route
            path="inventory"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                <InventoryPage />
              </RoleRoute>
            }
          />

          <Route
            path="inventory/add"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM"]}>
                <AddMedicine />
              </RoleRoute>
            }
          />

          <Route
            path="inventory/edit/:id"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM"]}>
                <EditMedicine />
              </RoleRoute>
            }
          />

          <Route
            path="inventory/restock/:id"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM"]}>
                <ReceiveMedicine />
              </RoleRoute>
            }
          />

          <Route
            path="inventory/:id"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                <MedicineDetail />
              </RoleRoute>
            }
          />

          <Route
            path="inventory/logs"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM"]}>
                <MedicineStockHistory />
              </RoleRoute>
            }
          />

          <Route
            path="/app/inventory/issue/:id"
            element={<RoleRoute allowedRoles={["ADMIN", "ANM"]}>
                <IssueMedicine />
              </RoleRoute>}
          />

          {/* ================= REPORTS ================= */}
          <Route
            path="reports"
            element={
              <RoleRoute allowedRoles={["ASHA", "ADMIN", "ANM"]}>
                <ReportsPage />
              </RoleRoute>
            }
          />

          {/* ================= HEALTH RECORDS ================= */}
          <Route
            path="health-records"
            element={
              <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                <HealthRecordsPage />
              </RoleRoute>
            }
          >
            <Route
              index
              element={
                <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                  <HealthRecordList />
                </RoleRoute>
              }
            />

            <Route
              path="add"
              element={
                <RoleRoute allowedRoles={["ANM", "ASHA"]}>
                  <AddHealthRecord />
                </RoleRoute>
              }
            />

            <Route
              path="edit/:id"
              element={
                <RoleRoute allowedRoles={["ANM", "ASHA"]}>
                  <EditHealthRecord />
                </RoleRoute>
              }
            />

            <Route
              path=":id"
              element={
                <RoleRoute allowedRoles={["ADMIN", "ANM", "ASHA"]}>
                  <HealthRecordDetail />
                </RoleRoute>
              }
            />
           
          </Route>

           
        </Route>

        {/* Catch All - Redirect to appropriate page */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/app/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;