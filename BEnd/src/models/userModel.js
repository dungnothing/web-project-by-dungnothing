import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (Name & Schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  userName: Joi.string().required().strict(),
  email: Joi.string().email().required().strict(),
  password: Joi.string().required().min(3).strict(),
  avatar: Joi.string().uri().default(null).strict(),
  message: Joi.string().default(`Tạo tài khoản lúc ${new Date().toLocaleString()}`).strict(),
  vip: Joi.boolean().default(false),

  boardIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  starBoardIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// Chi dinh ra nhung Fields ma chung ta khong muon cho phep cap nhat trong ham update()
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}


const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

const getUserByEmail = async (email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const createUser = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    // Hash password before saving
    validData.password = await bcrypt.hash(validData.password, 10) // Hash mật khẩu với độ dài 10
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    return createdUser
  } catch (error) { throw new Error(error) }
}

const pushBoardIds = async (userId, boardId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $push: { boardIds: boardId } }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const deleteBoardIds = async (userId, boardId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { boardIds: new ObjectId(boardId) } }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const findById = async (id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateName = async (userId, newUserName) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { userName: newUserName, message: `Tên tài khoản được đổi thành ${newUserName} lúc ${new Date().toLocaleString()}`, updatedAt: new Date() } }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updatePassword = async (userId, newPassword) => {
  try {
    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const result = await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword, message: `Mật khẩu được đổi lúc ${new Date().toLocaleString()}`, updatedAt: new Date() } }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateAvatar = async (userId, avatar) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { avatar: avatar, message: `Ảnh đại diện được đổi lúc ${new Date().toLocaleString()}`, updatedAt: new Date() } }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const removeBoardIds = async (userId, boardId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { boardIds: new ObjectId(boardId) } }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addStarBoard = async (userId, boardId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $push: { starBoardIds: new ObjectId(boardId) } },
      { returnDocument: 'after' }
    )
    return result.starBoardIds
  } catch (error) { throw new Error(error) }
}

const removeStarBoard = async (userId, boardId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $pull: { starBoardIds: new ObjectId(boardId) } },
      { returnDocument: 'after' }
    )
    return result.starBoardIds
  } catch (error) { throw new Error(error) }
}

const getStarBoard = async (userId) => {
  try {

    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(userId) })
    return result
  } catch (error) { throw new Error(error) }
}

const deleteAccount = async (userId) => {
  try {
    const deletedBoard = await GET_DB().collection(USER_COLLECTION_NAME).deleteOne({ _id: new ObjectId(userId) })
    return deletedBoard
  } catch (error) { throw new Error(error) }
}

const upgradeVip = async (userId, vipData) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { vip : vipData } }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  INVALID_UPDATE_FIELDS,
  validateBeforeCreate,
  comparePassword,
  getUserByEmail,
  createUser,
  findById,
  updateName,
  updatePassword,
  updateAvatar,
  pushBoardIds,
  deleteBoardIds,
  addStarBoard,
  removeStarBoard,
  getStarBoard,
  removeBoardIds,
  deleteAccount,
  upgradeVip
}
