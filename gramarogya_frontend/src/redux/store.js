import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import beneficiaryReducer from "./slices/beneficiarySlice";
import visitReducer from "./slices/visitSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    beneficiaries: beneficiaryReducer,
    visit: visitReducer, 
  },
});