import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'
import { uploadCardBackgroundToCloudinary } from '~/utils/cloudinary'

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) { next(error) }
}

const updateCard = async (req, res, next) => {
  try {
    const updateData = req.body
    const cardId = updateData.cardId
    const updatedCard = await cardService.updateCard(cardId, updateData)
    res.status(StatusCodes.OK).json(updatedCard)
  } catch (error) { next(error) }
}

const cancelEndTime = async(req, res, next) => {
  try {
    const updateData = req.body
    const cardId = updateData.cardId
    const updatedCard = await cardService.updateCard(cardId, updateData)
    res.status(StatusCodes.OK).json(updatedCard)
  } catch (error) { next(error) }
}

const updateCardBackground = async (req, res, next) => {
  try {
    const { cardId } = req.params
    const cardBackground = req.file ? await uploadCardBackgroundToCloudinary(req.file.buffer) : null
    const updatedCard = await cardService.updateCardBackground(cardId, cardBackground)
    res.status(StatusCodes.OK).json(updatedCard)
  } catch (error) { next(error) }
}

const joinCard = async (req, res, next) => {
  try {
    const { cardId } = req.params
    const userId = req.user ? req.user.userId : null
    const joinCard = await cardService.joinCard(cardId, userId)
    res.status(StatusCodes.OK).json(joinCard)
  } catch (error) { next(error) }
}

const leaveCard = async (req, res, next) => {
  try {
    const { cardId } = req.params
    const userId = req.user ? req.user.userId : null
    const joinCard = await cardService.leaveCard(cardId, userId)
    res.status(StatusCodes.OK).json(joinCard)
  } catch (error) { next(error) }
}

const getMember = async (req, res, next) => {
  try {
    const { cardId } = req.params
    const getMember = await cardService.getMember(cardId)
    res.status(StatusCodes.OK).json(getMember)
  } catch (error) { next(error) }
}
export const cardController = {
  createNew,
  updateCard,
  cancelEndTime,
  updateCardBackground,
  joinCard,
  leaveCard,
  getMember
}
