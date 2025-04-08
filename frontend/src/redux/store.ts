import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


import { useDispatch } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
