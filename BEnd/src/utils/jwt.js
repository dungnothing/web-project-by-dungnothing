// Tạo 2 hàm tạo token và giải mã token
import jwt from 'jsonwebtoken'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

// Tạo Access Token (thời gian ngắn)
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
}

// Tạo Refresh Token (thời gian dài hơn)
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

export const decodeAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

export const decodeRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}
