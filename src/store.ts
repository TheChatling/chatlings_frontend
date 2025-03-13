import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user/userSlice";
import alertSlice from "./features/alert/alertSlice";

const store = configureStore({
  reducer: { userData: userSlice, alertData: alertSlice },
});
export type AppDispatch = typeof store.dispatch;

export default store;
