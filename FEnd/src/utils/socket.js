/* eslint-disable no-console */
import { io } from 'socket.io-client'
import { API_ROOT } from './constants'

// Kết nối đến server backend
const socket = io(API_ROOT, {
  transports: ['websocket'], // Ưu tiên WebSocket
  withCredentials: true
})

// Lắng nghe sự kiện từ server
socket.on('connect', () => {
  console.log('Đã kết nối tới server:', socket.id)
})

socket.on('message', (msg) => {
  console.log('Tin nhắn từ server:', msg)
})

// Hàm gửi tin nhắn
export const sendMessage = (message) => {
  socket.emit('message', message)
}

// Xuất socket để dùng trong các component khác
export default socket
