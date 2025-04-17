import { userModel } from '../models/userModel'
import ApiError from '../utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { generateAccessToken, generateRefreshToken, decodeRefreshToken } from '../utils/jwt'
import { uploadToCloudinary } from '../utils/cloudinary'
import { boardModel } from '../models/boardModel'
import { boardService } from './boardService'
import { deleteImageFromCloudinary } from '../utils/cloudinary'
import { sendEmail } from '~/utils/email'
import crypto from 'crypto'

const login = async (email, password) => {
  try {
    const user = await userModel.getUserByEmail(email)
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy người dùng')
    }
    const isMatch = await userModel.comparePassword(password, user.password)
    if (!isMatch) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Mật khẩu không chính xác')
    }
    const accessToken = generateAccessToken({ userId: user._id }, '1h') // Hết hạn sau 1 giờ
    const refreshToken = generateRefreshToken({ userId: user._id }, '7d') // Hết hạn sau 7 ngày
    return {
      accessToken,
      refreshToken,
      userId: user._id,
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
      message: user.message,
      vip: user.vip
    }
  } catch (error) { throw error }
}

const register = async (reqBody) => {
  try {
    if (reqBody.avatar) {
      const uploadResult = await uploadToCloudinary(reqBody.avatar)
      reqBody.avatar = uploadResult.secure_url
    }
    const newUser = {
      ...reqBody
    }
    const email = newUser.email
    const checkUser = await userModel.getUserByEmail(email)
    if (checkUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Người dùng đã tồn tại')
    }
    const user = await userModel.createUser(newUser)
    const getNewUser = await userModel.findById(user.insertedId)
    return getNewUser
  } catch (error) { throw error }
}

const updatePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await userModel.findById(userId)
    const isMatch = await userModel.comparePassword(currentPassword, user.password)
    if (!isMatch) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Current password is incorrect')
    await userModel.updatePassword(userId, newPassword)
    return user
  } catch (error) {
    throw error
  }
}

const updateName = async (userId, newUserName) => {
  try {
    const user = await userModel.findById(userId)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    user.userName = newUserName
    await userModel.updateName(userId, newUserName)
    return { newUserName: newUserName, message: user.message }
  } catch (error) {
    throw error
  }
}

const updateAvatar = async (userId, newAvatar) => {
  try {
    const user = await userModel.findById(userId)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    if (user.avatar) {
      const oldAvatarPublicId = user.avatar.split('/').pop().split('.')[0]
      const folder = 'avatars' // Thư mục chứa ảnh
      const fullPublicId = `${folder}/${oldAvatarPublicId}`
      await deleteImageFromCloudinary(fullPublicId)
    }

    user.avatar = newAvatar
    await userModel.updateAvatar(userId, newAvatar)
    return user
  } catch (error) {
    throw error
  }
}

const pushBoardIds = async (userId, boardId) => {
  try {
    const result = await userModel.pushBoardIds(userId, boardId)
    return result
  } catch (error) { throw error }
}

const addStarBoard = async (userId, boardId) => {
  try {
    const board = await boardModel.findOneById(boardId)
    await userModel.addStarBoard(userId, boardId)
    return { starBoardIds: [boardId], title: board.title }
  } catch (error) { throw error }
}

const removeStarBoard = async (userId, boardId) => {
  try {
    const board = await boardModel.findOneById(boardId)
    const result = await userModel.removeStarBoard(userId, boardId)
    return { starBoardIds: result, title: board.title }
  } catch (error) { throw error }
}

const getStarBoard = async (userId) => {
  try {
    const result = await userModel.getStarBoard(userId)
    const boardDetails = await Promise.all(
      result.starBoardIds.map(async (boardId) => {
        const board = await boardModel.findOneById(boardId)
        return board.title
      })
    )
    return { starBoardIds: result.starBoardIds, title: boardDetails }
  } catch (error) { throw error }
}

const deleteAccount = async (userId) => {
  try {
    const user = await userModel.findById(userId)
    if (!user) {
      return new Error('Loi roi')
    }

    await boardService.deleteManyBoard(userId)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    if (user.avatar) {
      const oldAvatarPublicId = user.avatar.split('/').pop().split('.')[0]
      const folder = 'avatars' // Thư mục chứa ảnh
      const fullPublicId = `${folder}/${oldAvatarPublicId}`
      await deleteImageFromCloudinary(fullPublicId)
    }

    await userModel.deleteAccount(userId)
    return 'xoa thanh cong'
  } catch (error) { throw error }
}

const forgotPassword = async (email) => {
  try {
    const user = await userModel.getUserByEmail(email)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    const userId = user._id
    const newPassword = crypto.randomBytes(6).toString('hex')
    await userModel.updatePassword(userId, newPassword)
    await sendEmail(email, 'Forgot Password', `Mật khẩu mới của bạn là: ${newPassword}`)
    return user
  } catch (error) { throw error }
}

const refreshToken = async (data) => {
  try {
    const refreshToken = data.refreshToken
    const userData = decodeRefreshToken(refreshToken)
    const userId = userData.userId
    if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token')
    const accessToken = generateAccessToken({ userId: userId }, '1h') // Hết hạn sau 1 giờ
    return { accessToken }
  } catch (error) { throw error }
}

const upgradeVip = async (userId, data) => {
  try {
    const user = await userModel.findById(userId)
    if (!user) {
      return new Error('Loi roi')
    }
    const vipData = data.vip
    await userModel.upgradeVip(userId, vipData)
    return 'Nạp vip thành công'
  } catch (error) { throw error }
}

const getUserData = async (userId) => {
  try {
    const user = await userModel.findById(userId)
    const boardIds = user.boardIds
    return { listBoard: boardIds }
  } catch (error) { throw error }
}

export const userServices = {
  login,
  register,
  updateName,
  updatePassword,
  updateAvatar,
  pushBoardIds,
  addStarBoard,
  removeStarBoard,
  getStarBoard,
  deleteAccount,
  forgotPassword,
  refreshToken,
  upgradeVip,
  getUserData
}
