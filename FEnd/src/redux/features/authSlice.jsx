import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  user: {
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    userId: localStorage.getItem('userId') || null,
    userName: localStorage.getItem('userName') || null,
    email: localStorage.getItem('email') || null,
    avatar: localStorage.getItem('avatar') || '/default-avatar.png',
    vip: localStorage.getItem('vip') || false
  },
  notifications: []
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { userName, email, avatar, accessToken, refreshToken, vip, userId } = action.payload
      state.isAuthenticated = true
      state.user = { accessToken, refreshToken, userName, email, avatar, vip, userId }

      // Lưu thông tin vào localStorage
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('userId', userId)
      localStorage.setItem('userName', userName)
      localStorage.setItem('email', email)
      localStorage.setItem('avatar', avatar || 'none')
      localStorage.setItem('vip', vip || 'none')
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = initialState.user
      state.notifications = []

      // Xóa thông tin khỏi localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userName')
      localStorage.removeItem('email')
      localStorage.removeItem('avatar')
      localStorage.removeItem('vip')
      localStorage.removeItem('userId')
    },
    updateUserInfo: (state, action) => {
      state.user = { ...state.user, ...action.payload }

      // Cập nhật localStorage
      Object.keys(action.payload).forEach(key => {
        localStorage.setItem(key, action.payload[key])
      })
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload
    },
    addNotification: (state, action) => {
      // Kiểm tra payload
      if (!action.payload) {
        return
      }
      // Thêm notification mới vào đầu mảng
      state.notifications = [
        action.payload,
        ...state.notifications
      ]
    },
    markNotificationsAsRead: (state) => {
      state.notifications = []
    }
  }
})

export const {
  setCredentials,
  logout,
  updateUserInfo,
  setNotifications,
  addNotification,
  markNotificationsAsRead
} = authSlice.actions

export default authSlice.reducer
