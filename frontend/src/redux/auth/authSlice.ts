import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser, checkStoredToken } from "./authThunks";

interface AuthState {
    isAuthenticated: boolean;
    userId: string | null;
    loading: boolean;
  }

const initialState: AuthState = {
    isAuthenticated: false,
    userId: null,
    loading: true,
  };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.userId = action.payload.userId;
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(checkStoredToken.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload;
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
