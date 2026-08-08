import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import beneficiaryReducer from "./slices/beneficiarySlice";
import visitReducer from "./slices/visitSlice";
import healthRecordReducer from "./slices/healthRecordSlice";
import dashboardReducer from "./slices/dashboardSlice";
import inventoryReducer from "./slices/inventorySlice";
import reportReducer from "./slices/reportSlice";
import profileReducer from "./slices/profileSlice";
import searchReducer from "./slices/searchSlice";
import notificationReducer from "./slices/notificationSlice";
import adminReducer from "./slices/adminSlice";
import ashaReducer from "./slices/ashaSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    beneficiaries: beneficiaryReducer,
    visit: visitReducer, 
    healthRecords: healthRecordReducer,
    dashboard: dashboardReducer,
    inventory: inventoryReducer, 
    reports: reportReducer,
    profile: profileReducer,
    search: searchReducer, 
    notification: notificationReducer,
    admin: adminReducer,
    asha: ashaReducer,
  },
});

