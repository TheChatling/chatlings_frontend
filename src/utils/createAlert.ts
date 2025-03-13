import { setAlert } from "@/features/alert/alertSlice";
import { AppDispatch } from "@/store";

let alertTimeout: NodeJS.Timeout | null = null;
const createAlert = (dispatch: AppDispatch, message: string, state: string) => {
  dispatch(setAlert({ message, state, isVisible: true }));
  if (alertTimeout) {
    clearTimeout(alertTimeout);
  }
  alertTimeout = setTimeout(() => {
    dispatch(setAlert({ message: "", state: "", isVisible: false }));
  }, 10000);
};
export default createAlert;
