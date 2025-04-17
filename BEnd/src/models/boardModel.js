import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { BOARD_VISIBILITY } from '~/utils/constants'
import { cardModel } from './cardModel'
import { columnModel } from './columnModel'
import { userModel } from './userModel'

// Define Collection (Name & Schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  adminId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(1).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  visibility: Joi.string().valid(BOARD_VISIBILITY.PUBLIC, BOARD_VISIBILITY.PRIVATE).required(),
  boardState: Joi.string().default('open'),
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// Chi dinh ra nhung Fields ma chung ta khong muon cho phep cap nhat trong ham update()
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'userId']

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// Ham tao lien quan toi board
const getAllAccessibleBoards = async (userId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).find({
      $or: [
        { adminId: new ObjectId(userId) },
        { memberIds: new ObjectId(userId) },
        { visibility: BOARD_VISIBILITY.PUBLIC }
      ]
    }).toArray()
    return result
  } catch (error) { throw new Error(error) }
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newBoard = {
      ...validData,
      adminId: new ObjectId(validData.adminId)
    }
    const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(newBoard)
    return createdBoard
  } catch (error) { throw new Error(error) }
}

const deleteBoard = async (boardId) => {
  try {
    const deletedBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).deleteOne({ _id: new ObjectId(boardId) })
    return deletedBoard
  } catch (error) { throw new Error(error) }
}

const deleteManyBoard = async (userId) => {
  try {
    const deletedBoards = await GET_DB().collection(BOARD_COLLECTION_NAME).deleteMany({ adminId: new ObjectId(userId) })
    return deletedBoards
  } catch (error) { throw new Error(error) }
}

const findOneById = async (boardId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(boardId) })
    return result
  } catch (error) { throw new Error(error) }
}

const getDetails = async (boardId) => {
  try {
    // const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(boardId),
          _destroy: false
        }
      },
      {
        $lookup: {
          from: columnModel.COLUMN_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'columns'
        }
      },
      {
        $lookup: {
          from: cardModel.CARD_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'cards'
        }
      }
    ]).toArray()

    return result[0] || null
  } catch (error) { throw new Error(error) }
}

const getAllUserInBoard = async (boardId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(boardId) })
    if (result) {
      const adminId = result.adminId
      const memberIds = result.memberIds
      const admin = await GET_DB().collection(userModel.USER_COLLECTION_NAME).findOne({ _id: new ObjectId(adminId) })
      const members = await GET_DB().collection(userModel.USER_COLLECTION_NAME).find({ _id: { $in: memberIds } }).toArray()
      return {
        admin:
        {
          adminName: admin.userName,
          adminAvatar: admin.avatar,
          adminEmail: admin.email
        },
        members: members.map(member => ({
          memberName: member.userName,
          memberAvatar: member.avatar,
          memberEmail: member.email
        }))
      }
    }
    return null
  } catch (error) { throw new Error(error) }
}

// Nhiem  vu la push 1 cai gia tri columnId vao cuoi mang columnOrderIds, push la them 1 phan tu vao cuoi mang
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $push: { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}

// Nhiem vu pull 1 phan tu columnId ra khoi mang columnOrderIds, pull la lay phan tu ra khoi mang roi xoa no di
const pullColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $pull: { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const update = async (boardId, updateData) => {
  try {
    // Loc nhung field khong cho phep cap nhat
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    // Doi voi nhung du lieu lien quan toi ObjectId, bien doi o day
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(_id => (new ObjectId(_id)))
    }

    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: updateData },
      { returnDocument: 'after' } //tra ve ket qua moi sau khi cap nhat
    )

    return result
  } catch (error) { throw new Error(error) }
}

// Ham cap nhat cac thuoc tinh title, visibility
const updateTitle = async (boardId, reqBody) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: { title: reqBody.title } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw error }
}

const updateVisibility = async (boardId, reqBody) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: { visibility: reqBody.visibility } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw error }
}

const updateBoardState = async (boardId, boardState) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: boardState },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw error }
}

// Ham quan ly thanh vien cua board
const addMemberToBoard = async (boardId, memberId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $push: { memberIds: new ObjectId(memberId) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw error
  }
}

const removeMemberFromBoard = async (boardId, memberId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $pull: { memberIds: new ObjectId(memberId) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw error }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  getAllAccessibleBoards,
  createNew,
  findOneById,
  deleteBoard,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds,
  updateTitle,
  updateVisibility,
  updateBoardState,
  addMemberToBoard,
  removeMemberFromBoard,
  getAllUserInBoard,
  deleteManyBoard
}
