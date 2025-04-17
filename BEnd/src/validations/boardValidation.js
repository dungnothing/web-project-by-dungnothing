import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_VISIBILITY } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const createNew = async (req, res, next) => {
  /**
   * Note: Mac dinh chung ta khong can phai custom o phia BE lam gi, de tu BE validate va custom massage phia FE
   * BE chi cam validate dam bao du lieu chuan xac, tra ve message mac dinh cua thu vien la duoc
   * Viec validate o BE la bat buoc vi day la diem cuoi de luu du lieu vao database
   */

  const correctCondition = Joi.object({
    title: Joi.string().required().min(1).max(50).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Khong duoc de trong',
      'string.max': 'Max la 50 than dang',
      'string.min': 'Min la 1 than dang',
      'string.trim': 'Deo duoc de trong o dau vao cuoi'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    visibility: Joi.string().valid(BOARD_VISIBILITY.PUBLIC, BOARD_VISIBILITY.PRIVATE).required(),
    adminId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })
  try {
    // Chi dinh abortEarly False de truong hop co nhieu loi validation thi tra ve tat ca loi
    await correctCondition.validateAsync(req.body, { abortEarly: false })

    // Validate du lieu xong xuoi hop li thi cho request di tiep sang Controller
    next()
  } catch (error) {
    next (new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

// Ham xoa board
const deleteBoard = async (req, res, next) => {
  const correctCondition = Joi.object({
    _id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })

  try {
    const validateData = { _id: req.params.id }
    await correctCondition.validateAsync(validateData, { abortEarly: false })
    next()
  } catch (error) {
    next (new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    // Khong require trong truong hop update
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    visibility: Joi.string().valid(BOARD_VISIBILITY.PUBLIC, BOARD_VISIBILITY.PRIVATE),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {
    // Chi dinh abortEarly False de truong hop co nhieu loi validation thi tra ve tat ca loi
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next (new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  const correctCondition = Joi.object({
    currentCardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

    prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array().required().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ),

    nextColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array().required().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {
    // Chi dinh abortEarly False de truong hop co nhieu loi validation thi tra ve tat ca loi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next (new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateTitle = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next (new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateVisibility = async (req, res, next) => {
  const correctCondition = Joi.object({
    visibility: Joi.string().valid(BOARD_VISIBILITY.PUBLIC, BOARD_VISIBILITY.PRIVATE).required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next (new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateBoardState = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardState: Joi.string().required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next (new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const addMemberToBoard = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().email().trim().strict()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next (new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const removeMemberFromBoard = async (req, res, next) => {
  const correctCondition = Joi.object({
    memberId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next (new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  createNew,
  deleteBoard,
  update,
  moveCardToDifferentColumn,
  updateTitle,
  updateVisibility,
  updateBoardState,
  addMemberToBoard,
  removeMemberFromBoard
}
