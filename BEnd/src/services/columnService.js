import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    // ...
    if (getNewColumn) {
      // Xu ly cau truc data truoc khi tra du lieu ve
      getNewColumn.cards = []

      // Cap nhat lai mang columnOrderIds trong collection board
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) { throw error }
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)
    return updatedColumn
  } catch (error) { throw error }
}

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)

    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }
    // Xoa column
    await columnModel.deleteOneById(columnId)

    // Xoa toan bo cards thuoc column
    await cardModel.deleteManyByColumnId(columnId)

    // Xoa columnId trong mang columnOrderIds cua Board chua no
    await boardModel.pullColumnOrderIds(targetColumn)

    return { deleteResult: 'Xoa het luon roi' }
  } catch (error) { throw error }
}


export const columnService = {
  createNew,
  update,
  deleteItem
}
