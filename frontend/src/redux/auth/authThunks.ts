import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (token: string) => {
    await AsyncStorage.setItem("token", token);
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return { token, userId: decoded.sub };
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await AsyncStorage.removeItem("token");
  return false;
});

export const checkStoredToken = createAsyncThunk(
  "auth/checkStoredToken",
  async () => {
    const token = await AsyncStorage.getItem("token");
    return !!token;
  }
);
