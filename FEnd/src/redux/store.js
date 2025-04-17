import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'

// Redux State management tool
const store = configureStore({
  reducer: {
    auth: authReducer
  }
})

export default store
