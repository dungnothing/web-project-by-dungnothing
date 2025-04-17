import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

const verifyToken = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const bearerToken = req.headers.authorization

    // Nếu không có token, đánh dấu là guest user
    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      req.user = null
      return next()
    }
    // Tách token từ Bearer string
    const token = bearerToken.split(' ')[1]
    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET)
    // Gán thông tin user vào req
    req.user = decoded
    next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: 'Invalid Token or Token expired'
    })
  }
}

export const authMiddleware = {
  verifyToken
}
