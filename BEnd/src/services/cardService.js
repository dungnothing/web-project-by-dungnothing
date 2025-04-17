import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      // Cap nhat lai mang cardOrderIds trong collection col
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) { throw error }
}

const updateCard = async (cardId, updateData) => {
  try {
    const updatedCard = await cardModel.updateCard(cardId, updateData)
    return updatedCard
  } catch (error) { throw error }
}

const updateCardBackground = async (cardId, file) => {
  try {
    const updatedCard = await cardModel.updateCardBackground(cardId, file)
    return updatedCard
  } catch (error) { throw error }
}

const cancelEndTime = async (cardId, updateData) => {
  try {
    const updatedCard = await cardModel.updateCard(cardId, updateData)
    return updatedCard
  } catch (error) { throw error }
}

const joinCard = async (cardId, userId) => {
  try {
    const joinCard = await cardModel.joinCard(cardId, userId)
    return joinCard
  } catch (error) {
    throw error
  }
}

const leaveCard = async (cardId, userId) => {
  try {
    const joinCard = await cardModel.leaveCard(cardId, userId)
    return joinCard
  } catch (error) {
    throw error
  }
}

const getMember = async (cardId) => {
  try {
    const joinCard = await cardModel.getMember(cardId)
    return joinCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  updateCard,
  cancelEndTime,
  updateCardBackground,
  joinCard,
  leaveCard,
  getMember
}
