import { createSlice } from "@reduxjs/toolkit";
import { AlertType } from "@/dataTypes";
type State = {
  alert: AlertType;
};
const initialState: State = {
  alert: { message: "", state: "", isVisible: false },
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.alert = {
        message: action.payload.message,
        state: action.payload.state,
        isVisible: action.payload.isVisible,
      };
    },
  },
});

export default alertSlice.reducer;
export const { setAlert } = alertSlice.actions;
