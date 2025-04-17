import { userServices } from '~/services/userService'
import { StatusCodes } from 'http-status-codes'
import { uploadAvatarToCloudinary } from '~/utils/cloudinary'


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const result = await userServices.login(email, password)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }

}

const register = async (req, res, next) => {
  try {
    const result = await userServices.register(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) { next(error) }
}


const updateName = async (req, res, next) => {
  try {
    const { userId } = req.user
    const { newUserName } = req.body
    const result = await userServices.updateName(userId, newUserName)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const updatePassword = async (req, res, next) => {
  try {
    const { userId } = req.user
    const { currentPassword, newPassword } = req.body
    const result = await userServices.updatePassword(userId, currentPassword, newPassword)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }

}

const updateAvatar = async (req, res, next) => {
  try {
    const { userId } = req.user
    const newAvatar = req.file ? await uploadAvatarToCloudinary(req.file.buffer) : null
    const result = await userServices.updateAvatar(userId, newAvatar)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const addStarBoard = async (req, res, next) => {
  try {
    const { userId } = req.user
    const { boardId } = req.params
    const result = await userServices.addStarBoard(userId, boardId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const removeStarBoard = async (req, res, next) => {
  try {
    const { userId } = req.user
    const { boardId } = req.params
    const result = await userServices.removeStarBoard(userId, boardId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getStarBoard = async (req, res, next) => {
  try {
    const { userId } = req.user
    const result = await userServices.getStarBoard(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const deleteAccount = async (req, res, next) => {
  try {
    const { userId } = req.user
    const result = await userServices.deleteAccount(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const result = await userServices.forgotPassword(email)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const refreshToken = async (req, res, next) => {
  try {
    const data = req.body
    const result = await userServices.refreshToken(data)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const upgradeVip = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.userId : null
    const data = req.body
    const result = await userServices.upgradeVip(userId, data)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getUserData = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.userId : null
    const result = await userServices.getUserData(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const userController = {
  login,
  register,
  updateName,
  updatePassword,
  updateAvatar,
  addStarBoard,
  removeStarBoard,
  getStarBoard,
  deleteAccount,
  forgotPassword,
  refreshToken,
  upgradeVip,
  getUserData
}

