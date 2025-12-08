// src/store/reducers/authReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1️⃣ Define your User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // add other fields your API returns
}

// 2️⃣ Auth state type
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  user: User | null;
}

// 3️⃣ Safe JSON parse helper
function parseJSON<T>(value: string | null): T | null {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

// 4️⃣ Initial state with safe localStorage parsing
const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  role: localStorage.getItem("role"),
  user: parseJSON<User>(localStorage.getItem("user")),
};

// 5️⃣ Create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        role: string;
        user: User;
      }>
    ) => {
      const { accessToken, refreshToken, role } = action.payload;
      console.log("Setting credentials in authReducer:", action.payload);
      console.log("Access Token:", accessToken);

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.role = role;
     

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);

    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    },
  },
});

// 6️⃣ Export actions and reducer
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
