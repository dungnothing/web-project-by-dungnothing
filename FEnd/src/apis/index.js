import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import { setCredentials } from '~/redux/features/authSlice'
import store from '~/redux/store'
import { logout } from '~/redux/features/authSlice'

// Tạo instance axios với config mặc định
const axiosInstance = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Thêm interceptor để tự động gửi token trong header
axiosInstance.interceptors.request.use((config) => {
  const state = store.getState()
  const accessToken = state.auth.user.accessToken
  if (accessToken) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${accessToken}`
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Hàm refresh token
const refreshAccessToken = async () => {
  try {
    const state = store.getState()
    const refreshToken = state.auth.user.refreshToken
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    const response = await axios.post(`${API_ROOT}/v1/users/refreshToken`, { refreshToken: refreshToken })
    if (response.status === 200) {
      const newAccessToken = response.data.accessToken
      // Cập nhật Redux với token mới
      store.dispatch(setCredentials({
        ...state.auth.user,
        accessToken: newAccessToken
      }))
      return newAccessToken
    }
  } catch (error) {
    store.dispatch(logout()) // Hết hạn refreshToken -> logout
    return null
  }
}

// Interceptor để refresh token nếu token hết hạn
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const newAccessToken = await refreshAccessToken()
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosInstance(originalRequest) // Gửi lại request với token mới
      }
    }
    return Promise.reject(error)
  }
)

// Boards
export const getAllAccessibleBoardsAPI = async () => {
  const response = await axiosInstance.get('/v1/boards/accessible')
  return response.data
}

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axiosInstance.get(`/v1/boards/${boardId}`)
  return response.data
}

export const createNewBoardAPI = async (boardData) => {
  const response = await axiosInstance.post('/v1/boards', boardData)
  return response.data
}

export const deleteBoardAPI = async (boardId) => {
  const response = await axiosInstance.delete(`/v1/boards/${boardId}/delete`)
  return response.data
}

export const deleteManyBoardAPI = async () => {
  const response = await axiosInstance.delete('/v1/boards')
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axiosInstance.put(`/v1/boards/${boardId}`, updateData)
  return response.data
}

export const updateBoardTitleAPI = async (boardId, updateData) => {
  const response = await axiosInstance.put(`/v1/boards/${boardId}/title`, updateData)
  return response.data
}

export const updateBoardVisibilityAPI = async (boardId, updateData) => {
  const response = await axiosInstance.put(`/v1/boards/${boardId}/visibility`, updateData)
  return response.data
}

export const updateBoardStateAPI = async (boardId, updateData) => {
  const response = await axiosInstance.put(`/v1/boards/${boardId}/state`, updateData)
  return response.data
}

export const addMemberToBoardAPI = async (boardId, inviteData) => {
  const response = await axiosInstance.post(`/v1/boards/${boardId}/members`, inviteData)
  return response.data
}

export const removeMemberFromBoardAPI = async (boardId, memberId) => {
  const response = await axiosInstance.delete(`/v1/boards/${boardId}/members/${memberId}`)
  return response.data
}

export const getAllUserInBoardAPI = async (boardId) => {
  const response = await axiosInstance.get(`/v1/boards/${boardId}/members`)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axiosInstance.put('/v1/boards/supports/moving_card', updateData)
  return response.data
}


// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axiosInstance.post('/v1/columns', newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axiosInstance.put(`/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axiosInstance.delete(`/v1/columns/${columnId}`)
  return response.data
}

// Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axiosInstance.post('/v1/cards', newCardData)
  return response.data
}

export const getDetailCardAPI = async (cardId) => {
  const response = await axiosInstance.get(`/v1/cards/${cardId}`)
  return response.data
}

export const updateCardAPI = async (cardId, updateData) => {
  const response = await axiosInstance.put(`/v1/cards/${cardId}`, updateData)
  return response.data
}

export const updateCardBackgroundAPI = async (cardId, updateData) => {
  const response = await axiosInstance.put(`/v1/cards/${cardId}/updateCardBackground`, updateData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const updateCancelCardAPI = async (cardId, updateData) => {
  const response = await axiosInstance.put(`/v1/cards/${cardId}/cancel`, updateData)
  return response.data
}

export const joinCardAPI = async (cardId) => {
  const response = await axiosInstance.post(`/v1/cards/${cardId}/joinCard`)
  return response.data
}

export const leaveCardAPI = async (cardId) => {
  const response = await axiosInstance.delete(`/v1/cards/${cardId}/leaveCard`)
  return response.data
}

export const getMemberAPI = async (cardId) => {
  const response = await axiosInstance.get(`/v1/cards/${cardId}/getMember`)
  return response.data
}

// Auth
export const signUpAPI = async (signUpData) => {
  const response = await axiosInstance.post('/v1/users/register', signUpData)
  return response.data
}

export const signInAPI = async (signInData) => {
  const response = await axiosInstance.post('/v1/users/login', signInData)
  return response.data
}

export const forgotPasswordAPI = async (email) => {
  const response = await axiosInstance.post('/v1/users/forgotPassword', email)
  return response.data
}

export const updateProfileAPI = async (updateData) => {
  const response = await axiosInstance.put('/v1/users/updateName', updateData)
  return response.data
}

export const updatePasswordAPI = async (updateData) => {
  const response = await axiosInstance.put('/v1/users/updatePassword', updateData)
  return response.data
}

export const updateVipAPI = async (updateData) => {
  const response = await axiosInstance.put('/v1/users/upgradeVip', updateData)
  return response.data
}

export const updateAvatarAPI = async (updateData) => {
  const response = await axiosInstance.put('/v1/users/updateAvatar', updateData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const addStarBoardAPI = async (boardId) => {
  const response = await axiosInstance.put(`/v1/users/starBoard/${boardId}`)
  return response.data
}

export const removeStarBoardAPI = async (boardId) => {
  const response = await axiosInstance.delete(`/v1/users/starBoard/${boardId}`)
  return response.data
}

export const getStarBoardAPI = async () => {
  const response = await axiosInstance.get('/v1/users/starBoard')
  return response.data
}


export const deleteAccountAPI = async () => {
  const response = await axiosInstance.delete('/v1/users/deleteAccount')
  return response.data
}