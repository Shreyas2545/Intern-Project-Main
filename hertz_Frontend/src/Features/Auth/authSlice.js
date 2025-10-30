import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: (() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      localStorage.removeItem("user");
      return null;
    }
  })(),
  isAdmin: (() => {
    try {
      const isAdminData = localStorage.getItem("isAdmin");
      return isAdminData ? JSON.parse(isAdminData) : false;
    } catch (e) {
      console.error("Error parsing isAdmin from localStorage:", e);
      localStorage.removeItem("isAdmin");
      return false;
    }
  })(),
  isAuthenticated: (() => {
    // Derive isAuthenticated from user presence
    const userData = localStorage.getItem("user");
    return userData && JSON.parse(userData) !== null;
  })(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user || action.payload.email; // Accept user object or email
      state.isAdmin = action.payload.isAdmin || false;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(state.user || null));
      localStorage.setItem("isAdmin", JSON.stringify(state.isAdmin));
    },
    logout: (state) => {
      state.user = null;
      state.isAdmin = false;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
      sessionStorage.removeItem("hasVisitedHome"); // For preloader
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
