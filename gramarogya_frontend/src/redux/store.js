import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import beneficiaryReducer from "./slices/beneficiarySlice";
import visitReducer from "./slices/visitSlice";
import healthRecordReducer from "./slices/healthRecordSlice";
import dashboardReducer from "./slices/dashboardSlice";
import inventoryReducer from "./slices/inventorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    beneficiaries: beneficiaryReducer,
    visit: visitReducer, 
    healthRecords: healthRecordReducer,
    dashboard: dashboardReducer,
    inventory: inventoryReducer, 
  },
});

