import { createSlice } from "@reduxjs/toolkit";

// Helper function to safely get token from localStorage
const getTokenFromStorage = () => {
    try {
        const token = localStorage.getItem("token");
        return token ? JSON.parse(token) : null;
    } catch (error) {
        console.error("Error parsing token from localStorage:", error);
        localStorage.removeItem("token"); // Remove corrupted token
        return null;
    }
};

const initialState = {
    signupData: null,
    loading: false,
    token: getTokenFromStorage(), // Initialize from localStorage
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
            
            // Sync with localStorage
            if (action.payload) {
                localStorage.setItem("token", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("token");
            }
        },
    },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;