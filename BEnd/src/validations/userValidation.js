import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required().strict(),
    password: Joi.string().min(6).required().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const register = async (req, res, next) => {
  const correctCondition = Joi.object({
    userName: Joi.string().required().strict(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    avatar: Joi.string().uri().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateName = async (req, res, next) => {
  const correctCondition = Joi.object({
    newUserName: Joi.string().required().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updatePassword = async (req, res, next) => {
  const correctCondition = Joi.object({
    currentPassword: Joi.string().min(6).required().strict(),
    newPassword: Joi.string().min(6).required().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const upgradeVip = async (req, res, next) => {
  const correctCondition = Joi.object({
    vip: Joi.boolean().required().strict()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const userValidation = {
  login,
  register,
  updateName,
  updatePassword,
  upgradeVip
}
