import { configureStore } from '@reduxjs/toolkit'
import auth from '../slice/authSlice'
import profile from '../slice/profileSlice'
export const store = configureStore({
  reducer: {
    auth: auth,
    profile: profile,
  },
})