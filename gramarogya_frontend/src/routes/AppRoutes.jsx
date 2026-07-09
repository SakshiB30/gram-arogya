import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useSelector } from "react-redux";

import MainLayout from "../layouts/MainLayout";


// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Dashboard
import Dashboard from "../pages/Dashboard";

// Beneficiary
import BeneficiaryPage from "../pages/BeneficiaryPage";
import BeneficiaryDetail from "../components/beneficiary/BeneficiaryDetail";
import AddBeneficiary from "../components/beneficiary/AddBeneficiary";
import EditBeneficiary from "../components/beneficiary/EditBeneficiary";

// Reports
import DailyReport from "../pages/reports/DailyReport";
import MyReports from "../pages/reports/MyReports";

// Verification
import VerifyReports from "../pages/VerifyReports";


// Medicine
import InventoryPage from "../pages/InventoryPage";
import AddMedicine from "../components/inventory/AddMedicine";
import EditMedicine from "../components/inventory/EditMedicine";
import RestockMedicine from "../components/inventory/RestockMedicine";
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


// Auth Guard
import ProtectedRoute from "./ProtectedRoute";



const AppRoutes = () => {


const {isAuthenticated} = useSelector(
(state)=>state.auth
);



return (

<BrowserRouter>

<Routes>


{/* Root */}

<Route

path="/"

element={

isAuthenticated ?

<Navigate 
to="/app/dashboard"
replace
/>

:

<Navigate
to="/login"
replace
/>

}

/>



{/* Auth */}

<Route 
path="/login"
element={<Login />}
/>


<Route
path="/register"
element={<Register />}
/>





{/* Application */}

<Route

path="/app"

element={

<ProtectedRoute>

<MainLayout />

</ProtectedRoute>

}

>


<Route

index

element={
<Navigate
to="dashboard"
replace
/>
}

/>





{/* Dashboard */}

<Route

path="dashboard"

element={<Dashboard />}

/>






{/* ==================
    BENEFICIARY
================== */}


<Route

path="beneficiaries"

element={<BeneficiaryPage />}

/>


<Route

path="beneficiaries/add"

element={<AddBeneficiary />}

/>


<Route

path="beneficiaries/:id"

element={<BeneficiaryDetail />}

/>


<Route

path="beneficiaries/edit/:id"

element={<EditBeneficiary />}

/>








{/* ==================
       VISIT
================== */}


<Route

path="visit"

element={<VisitPage />}

/>


<Route

path="visit/add"

element={<AddVisit />}

/>


<Route

path="visit/:id"

element={<VisitDetail />}

/>


<Route

path="visit/edit/:id"

element={<EditVisit />}

/>








{/* ==================
      MEDICINE
================== */}

<Route
    path="inventory"
    element={<InventoryPage />}
/>

<Route
    path="inventory/add"
    element={<AddMedicine />}
/>

<Route
    path="inventory/edit/:id"
    element={<EditMedicine />}
/>

<Route
    path="inventory/restock/:id"
    element={<RestockMedicine />}
/>

<Route
  path="inventory/:id"
  element={<MedicineDetail />}
/>





{/* ==================
    REPORTS
================== */}


<Route

path="daily-report"

element={<DailyReport />}

/>


<Route

path="my-reports"

element={<MyReports />}

/>


<Route

path="verify-reports"

element={<VerifyReports />}

/>








{/* ==================
    HEALTH RECORDS
================== */}


<Route

path="health-records"

element={<HealthRecordsPage />}

>


<Route

index

element={<HealthRecordList />}

/>


<Route

path="add"

element={<AddHealthRecord />}

/>


<Route

path="edit/:id"

element={<EditHealthRecord />}

/>


<Route

path=":id"

element={<HealthRecordDetail />}

/>


</Route>



</Route>







<Route

path="*"

element={
<Navigate
to="/login"
replace
/>
}

/>



</Routes>


</BrowserRouter>


);


};


export default AppRoutes;