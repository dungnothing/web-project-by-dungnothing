import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { userModel } from './userModel'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  background: Joi.string().uri().default(null).strict(),

  title: Joi.string().required().min(1).max(50).trim().strict(),
  description: Joi.string().default(null),
  isDone: Joi.boolean().default(false),
  endTime: Joi.date().iso().default(null),
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// Chi dinh ra nhung Fields ma chung ta khong muon cho phep cap nhat trong ham update()
const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    // Bien doi 1 so du lieu lien quan toi ObjectId
    const newCardToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)
    }

    const createdCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)
    return createdCard
  } catch (error) { throw new Error(error) }
}

const findOneById = async (cardId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(cardId) })
    return result
  } catch (error) { throw new Error(error) }
}

const update = async (cardId, updateData) => {
  try {
    // Loc nhung field khong cho phep cap nhat
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    // Doi voi nhung du lieu lien quan ObjectId, bien doi o day (tuy sau nay neu can thi tach function rieng)
    if (updateData.columnId) updateData.columnId = new ObjectId(updateData.columnId)

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: updateData },
      { returnDocument: 'after' } //tra ve ket qua moi sau khi cap nhat
    )

    return result
  } catch (error) { throw new Error(error) }
}

const updateCardBackground = async (cardId, file) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: { background: file } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({ columnId: new ObjectId(columnId) })
    return result
  } catch (error) { throw new Error(error) }
}

const deleteManyByBoardId = async (boardId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({
      boardId: new ObjectId(boardId)
    })
    return result
  } catch (error) { throw new Error(error) }
}

const updateCard = async (cardId, updateData) => {
  try {
    // Tạo một object rỗng để chứa dữ liệu cần cập nhật
    let updateFields = {}

    if (updateData?.isDone !== undefined) {
      updateFields.isDone = updateData.isDone
    }

    if (updateData?.endTime !== undefined) {
      updateFields.endTime = updateData.endTime
    }

    if (updateData?.description !== undefined) {
      updateFields.description = updateData.description
    }
    // Nếu không có trường nào để cập nhật thì thoát luôn
    if (Object.keys(updateFields).length === 0) {
      return 'Không có dữ liệu cần cập nhật'
    }

    // Gọi database để cập nhật
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: updateFields },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const cancelEndTime = async (cardId, updateData) => {
  try {
    // Gọi database để cập nhật
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: { endTime: updateData } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const joinCard = async (cardId, userId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(cardId) },
      { $push: { memberIds: new ObjectId(userId) } }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const leaveCard = async (cardId, userId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(cardId) },
      { $pull: { memberIds: new ObjectId(userId) } }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const getMember = async (cardId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(cardId) })
    const memberIds = result.memberIds
    const members = await GET_DB().collection(userModel.USER_COLLECTION_NAME).find({ _id: { $in: memberIds } }).toArray()
    return {
      members: members.map(member => ({
        memberName: member.userName,
        memberAvatar: member.avatar,
        memberEmail: member.email
      }))
    }
  } catch (error) { throw new Error(error) }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId,
  deleteManyByBoardId,
  updateCard,
  cancelEndTime,
  updateCardBackground,
  joinCard,
  leaveCard,
  getMember
}