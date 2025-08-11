import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Initial state setup
const initialState = {
  signupData: null,
  loading: false,
  token: Cookies.get("token") || null, 
};

// Create auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set signup data
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    // Set loading state
    setLoading(state, action) {
      state.loading = action.payload;
    },
    // Set token (e.g., after login/signup)
    setToken(state, action) {
      state.token = action.payload;

      if (action.payload) {
        // Set token in cookie
        Cookies.set("token", action.payload, { expires: 3, secure: true, sameSite: "Strict" });
      } else {
        // Remove token from cookie
        Cookies.remove("token");
      }
    },
  },
});

// Export actions
export const { setSignupData, setLoading, setToken } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
