import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import doctorSearchReducer from "./slices/doctorSearchSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctorSearch: doctorSearchReducer,
  },
});
