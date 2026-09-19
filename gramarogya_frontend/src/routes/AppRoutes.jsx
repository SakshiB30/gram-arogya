import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { useSelector } from "react-redux";

// Layouts
import NetworkAwareLayout from "../layouts/NetworkAwareLayout";
import OfflineBeneficiaries from "../pages/offline/OfflineBeneficiaries";
import OfflineBeneficiaryDetail from "../pages/offline/OfflineBeneficiaryDetail";
import OfflineVisits from "../pages/offline/OfflineVisits";
import OfflineVisitDetail from "../pages/offline/OfflineVisitDetail";
import CreateOfflineVisit from "../pages/offline/CreateOfflineVisit";
import OfflineHealthRecords from "../pages/offline/OfflineHealthRecords";
import CreateOfflineHealthRecord from "../pages/offline/CreateOfflineHealthRecord";
import OfflineHealthRecordDetail from "../pages/offline/OfflineHealthRecordDetail";
import PendingSync from "../pages/offline/PendingSync";


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

// Medicine Stock History
import MedicineStockHistory from "../components/inventory/MedicineStockHistory";

// Admin
import ManageUsers from "../components/dashboard/admin/ManageUsers";


const AppRoutes = () => {
  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            ROOT
        ===================================================== */}

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


        {/* =====================================================
            AUTH
        ===================================================== */}

        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate
                to="/app/dashboard"
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate
                to="/app/dashboard"
                replace
              />
            ) : (
              <Register />
            )
          }
        />

        {/* Register ANM */}
        <Route
          path="/register/anm"
          element={
            isAuthenticated ? (
              <Navigate
                to="/app/dashboard"
                replace
              />
            ) : (
              <RegisterAnm />
            )
          }
        />

        {/* Register ASHA */}
        <Route
          path="/register/asha"
          element={
            isAuthenticated ? (
              <Navigate
                to="/app/dashboard"
                replace
              />
            ) : (
              <RegisterAsha />
            )
          }
        />

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />


        {/* =====================================================
            PROTECTED APPLICATION
        ===================================================== */}

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <NetworkAwareLayout />
            </ProtectedRoute>
          }
        >

          {/* ===================================================
              DEFAULT
          =================================================== */}

          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />


          {/* ===================================================
              ADMIN - MANAGE USERS
          =================================================== */}

          <Route
            path="manage-users"
            element={
              <RoleRoute allowedRoles={["ADMIN"]}>
                <ManageUsers />
              </RoleRoute>
            }
          />


          {/* ===================================================
              DASHBOARD
          =================================================== */}

          <Route
            path="dashboard"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "ANM",
                  "ASHA",
                ]}
              >
                <Dashboard />
              </RoleRoute>
            }
          />


          {/* ===================================================
              PROFILE
          =================================================== */}

          <Route
            path="profile"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "ANM",
                  "ASHA",
                ]}
              >
                <Profile />
              </RoleRoute>
            }
          />


          {/* ===================================================
              BENEFICIARIES
          =================================================== */}

          <Route
            path="beneficiaries"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "ANM",
                  "ASHA",
                ]}
              >
                <BeneficiaryPage />
              </RoleRoute>
            }
          />

          <Route
            path="beneficiaries/add"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "ANM",
                  "ASHA",
                ]}
              >
                <AddBeneficiary />
              </RoleRoute>
            }
          />

          <Route
            path="beneficiaries/:id"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "ANM",
                  "ASHA",
                ]}
              >
                <BeneficiaryDetail />
              </RoleRoute>
            }
          />

          <Route
            path="beneficiaries/edit/:id"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "ANM",
                  "ASHA",
                ]}
              >
                <EditBeneficiary />
              </RoleRoute>
            }
          />


          {/* ===================================================
              VISITS
          =================================================== */}

          <Route
            path="visit"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "ANM",
                  "ASHA",
                ]}
              >
                <VisitPage />
              </RoleRoute>
            }
          />

          <Route
            path="visit/add"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "ANM",
                  "ASHA",
                ]}
              >
                <AddVisit />
              </RoleRoute>
            }
          />

          <Route
            path="visit/:id"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "ANM",
                  "ASHA",
                ]}
              >
                <VisitDetail />
              </RoleRoute>
            }
          />

          <Route
            path="visit/edit/:id"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "ANM",
                  "ASHA",
                ]}
              >
                <EditVisit />
              </RoleRoute>
            }
          />


          {/* ===================================================
              INVENTORY - ADMIN ONLY
          =================================================== */}

          <Route
            path="inventory"
            element={
              <RoleRoute allowedRoles={["ADMIN"]}>
                <InventoryPage />
              </RoleRoute>
            }
          />

          <Route
            path="inventory/add"
            element={
              <RoleRoute allowedRoles={["ADMIN"]}>
                <AddMedicine />
              </RoleRoute>
            }
          />

          <Route
            path="inventory/edit/:id"
            element={
              <RoleRoute allowedRoles={["ADMIN"]}>
                <EditMedicine />
              </RoleRoute>
            }
          />

          <Route
            path="inventory/restock/:id"
            element={
              <RoleRoute allowedRoles={["ADMIN"]}>
                <ReceiveMedicine />
              </RoleRoute>
            }
          />

          <Route
            path="inventory/:id"
            element={
              <RoleRoute allowedRoles={["ADMIN"]}>
                <MedicineDetail />
              </RoleRoute>
            }
          />

          <Route
            path="inventory/logs"
            element={
              <RoleRoute allowedRoles={["ADMIN"]}>
                <MedicineStockHistory />
              </RoleRoute>
            }
          />


          {/* ===================================================
              REPORTS
          =================================================== */}

          <Route
            path="reports"
            element={
              <RoleRoute
                allowedRoles={[
                  "ASHA",
                  "ADMIN",
                  "ANM",
                ]}
              >
                <ReportsPage />
              </RoleRoute>
            }
          />


          {/* ===================================================
              HEALTH RECORDS
          =================================================== */}

          <Route
            path="health-records"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "ANM",
                  "ASHA",
                ]}
              >
                <HealthRecordsPage />
              </RoleRoute>
            }
          >

            <Route
              index
              element={
                <RoleRoute
                  allowedRoles={[
                    "ADMIN",
                    "ANM",
                    "ASHA",
                  ]}
                >
                  <HealthRecordList />
                </RoleRoute>
              }
            />

            <Route
              path="add"
              element={
                <RoleRoute
                  allowedRoles={[
                    "ANM",
                    "ASHA",
                  ]}
                >
                  <AddHealthRecord />
                </RoleRoute>
              }
            />

            <Route
              path="edit/:id"
              element={
                <RoleRoute
                  allowedRoles={[
                    "ANM",
                    "ASHA",
                  ]}
                >
                  <EditHealthRecord />
                </RoleRoute>
              }
            />

            <Route
              path=":id"
              element={
                <RoleRoute
                  allowedRoles={[
                    "ADMIN",
                    "ANM",
                    "ASHA",
                  ]}
                >
                  <HealthRecordDetail />
                </RoleRoute>
              }
            />

          </Route>


          {/* ===================================================
              ASHA OFFLINE WORKSPACE
          =================================================== */}

          <Route
  path="offline"
  element={
    <RoleRoute allowedRoles={["ASHA"]}>
      <Outlet />
    </RoleRoute>
  }
>
  <Route
    index
    element={<Navigate to="beneficiaries" replace />}
  />

  <Route
  path="beneficiaries"
  element={
    <RoleRoute allowedRoles={["ASHA"]}>
      <OfflineBeneficiaries />
    </RoleRoute>
  }
/>

<Route
    path="beneficiaries/:id"
    element={
      <RoleRoute allowedRoles={["ASHA"]}>
        <OfflineBeneficiaryDetail />
      </RoleRoute>
    }
  />

  <Route
  path="visits"
  element={
    <RoleRoute allowedRoles={["ASHA"]}>
      <OfflineVisits />
    </RoleRoute>
  }
/>

<Route
  path="visits/:id"
  element={
    <RoleRoute allowedRoles={["ASHA"]}>
      <OfflineVisitDetail />
    </RoleRoute>
  }
/>
    <Route
  path="visits/create"
  element={
    <RoleRoute allowedRoles={["ASHA"]}>
      <CreateOfflineVisit />
    </RoleRoute>
  }
/>
  

  <Route
    path="health-records"
    element={
      <RoleRoute allowedRoles={["ASHA"]}>
        <OfflineHealthRecords />
      </RoleRoute>
    }
  />

  <Route
    path="health-records/create"
    element={
      <RoleRoute allowedRoles={["ASHA"]}>
        <CreateOfflineHealthRecord />
      </RoleRoute>
    }
  />
    <Route
  path="health-records/:id"
  element={
    <RoleRoute allowedRoles={["ASHA"]}>
      <OfflineHealthRecordDetail />
    </RoleRoute>
  }
/>


  <Route
    path="pending-sync"
    element={
      <RoleRoute allowedRoles={["ASHA"]}>
         <PendingSync />
      </RoleRoute>
    }
  />
</Route>

        </Route>


        {/* =====================================================
            CATCH ALL
        ===================================================== */}

        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate
                to="/app/dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/"
                replace
              />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;