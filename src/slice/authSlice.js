import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Initial state setup
const initialState = {
  signupData: null,
  loading: false,
  token: Cookies.get("token") || null, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
      if (action.payload) {
        Cookies.set("token", action.payload, { expires: 7 }); // 7 din ke liye store
      } else {
        Cookies.remove("token");
      }
    },
    logout(state) {
      state.token = null;
      state.signupData = null;
      Cookies.remove("token");
    },
  },
});

export const { setSignupData, setLoading, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
