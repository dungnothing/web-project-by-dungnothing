import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { userModel } from '~/models/userModel'
import { ObjectId } from 'mongodb'

const createNew = async (reqBody, userId) => {
  try {
    // Xu li logic du lieu tuy dac thu du an
    const user = await userModel.findById(userId)
    if (user.vip === false && user.boardIds.length >= 5) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Bạn chỉ được tạo 5 bảng thôi, hãy nạp vip nhé')
    }
    const newBoard = {
      ...reqBody,
      adminId: userId,
      slug: slugify(reqBody.title)
    }
    // Goi toi tang Model de luu du lieu vao databsae
    const createdBoard = await boardModel.createNew(newBoard)
    const boardId = createdBoard.insertedId
    // Cap nhat userId vao mang boardIds trong collection user
    await userModel.pushBoardIds(userId, boardId)
    // Lay ban ghi board sau khi goi
    const getNewBoard = await boardModel.findOneById(boardId)
    // Tra ket qua ve trong Service, luon phai co return
    return getNewBoard
  } catch (error) { throw error }
}

const getAllAccessibleBoards = async (userId) => {
  try {
    const boards = await boardModel.getAllAccessibleBoards(userId)
    return boards
  } catch (error) { throw error }
}

const getDetails = async (boardId, userId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    //1: Clonedeep ra 1 cai moi de xu ly, khong anh huong toi board ban dau, tuy muc dich su dung
    const resBoard = cloneDeep(board)
    const isAdmin = userId ? resBoard.adminId.equals(new ObjectId(userId)) : false
    const isMember = userId ? resBoard.memberIds.some(id => id.equals(new ObjectId(userId))) : false
    const isGuest = !isAdmin && !isMember
    if (isAdmin) {
      resBoard.permissions = 'admin'
    }
    if (isMember) {
      resBoard.permissions = 'member'
    }
    if (isGuest) {
      resBoard.permissions = 'guest'
    }
    delete resBoard.adminId
    delete resBoard.memberIds
    delete resBoard.slug
    delete resBoard._destroy
    delete resBoard.createdAt
    delete resBoard.updatedAt
    return resBoard
  } catch (error) { throw error }
}

const getAllUserInBoard = async (boardId) => {
  try {
    const board = await boardModel.getAllUserInBoard(boardId)
    return board
  } catch (error) { throw error }
}

const deleteBoard = async (boardId, userId) => {
  try {
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy bảng')
    }
    const adminId = board.adminId
    if (userId !== adminId.toString()) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Bình tĩnh bạn hiền. Bạn có phải là chủ đâu :D')
    }
    await cardModel.deleteManyByBoardId(boardId)
    await columnModel.deleteManyByBoardId(boardId)
    await userModel.removeStarBoard(userId, boardId)
    await userModel.removeBoardIds(userId, boardId)
    const deletedBoard = await boardModel.deleteBoard(boardId)
    return deletedBoard
  } catch (error) { throw error }
}

const deleteManyBoard = async (userId) => {
  try {
    const userAllThing = await userModel.findById(userId)
    const boardList = userAllThing.boardIds
    await Promise.all(boardList.map(async (boardId) => {
      await cardModel.deleteManyByBoardId(boardId)
      await columnModel.deleteManyByBoardId(boardId)
      await userModel.removeStarBoard(userId, boardId)
      await userModel.removeBoardIds(userId, boardId)
    }
    ))
    const result = await boardModel.deleteManyBoard(userId)
    return result
  } catch (error) {
    throw (error)
  }
}

const update = async (boardId, reqBody) => {
  try {

    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) { throw error }
}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // Cap nhat mang cardOrderIds cua Column ban dau chua no (xoa _id ra khoi mang)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updateAt: Date.now()
    })
    // Cap nhat mang cardOrderIds cua Column tiep theo (them _id vao mang) va cap nhat la truong columnId moi
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updateAt: Date.now()
    })

    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { updateResult: 'Sucessfully!' }
  } catch (error) { throw error }
}

const getBoardsByAdminId = async (adminId) => {
  try {
    const boards = await boardModel.getBoardsByAdminId(adminId)
    return boards
  } catch (error) { throw error }
}

// Ham cap nhat thuoc tinh title, visibility
const updateTitle = async (boardId, reqBody, userId) => {
  try {
    const isAdmin = await boardModel.getDetails(boardId)
    if (userId !== isAdmin.adminId.toString()) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền cập nhật tên bảng')
    }
    const updatedBoard = await boardModel.updateTitle(boardId, reqBody)
    return updatedBoard
  } catch (error) { throw error }
}

const updateVisibility = async (boardId, reqBody, userId) => {
  try {
    const isAdmin = await boardModel.getDetails(boardId)
    if (userId !== isAdmin.adminId.toString()) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền cập nhật tính bảo mật')
    }
    const updatedBoard = await boardModel.updateVisibility(boardId, reqBody)
    return updatedBoard
  } catch (error) { throw error }
}

const updateBoardState = async (boardId, boardState, userId) => {
  try {
    const isAdmin = await boardModel.getDetails(boardId)
    if (userId !== isAdmin.adminId.toString()) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền cập nhật trạng thái bảng')
    }
    const updatedBoard = await boardModel.updateBoardState(boardId, boardState)
    return updatedBoard
  } catch (error) { throw error }
}

// Ham quan ly thanh vien cua board
const addMemberToBoard = async (boardId, email, userId) => {
  try {
    const isAdmin = await boardModel.getDetails(boardId)
    if (userId !== isAdmin.adminId.toString()) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền mời thành viên')
    }
    const member = await userModel.getUserByEmail(email)
    if (!member) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Thành viên không tồn tại')
    }
    if (member._id.equals(isAdmin.adminId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Không thể mời admin')
    }
    const isMember = isAdmin.memberIds.some(id => id.equals(new ObjectId(member._id)))
    if (isMember) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Thành viên đã tồn tại')
    }
    await boardModel.addMemberToBoard(boardId, member._id)
    return { email: member.email }
  } catch (error) { throw error }

}

const removeMemberFromBoard = async (boardId, memberId) => {
  try {
    const updatedBoard = await boardModel.removeMemberFromBoard(boardId, memberId)
    return updatedBoard
  } catch (error) { throw error }
}

export const boardService = {
  createNew,
  deleteBoard,
  getDetails,
  update,
  moveCardToDifferentColumn,
  updateTitle,
  updateVisibility,
  getBoardsByAdminId,
  updateBoardState,
  addMemberToBoard,
  removeMemberFromBoard,
  getAllAccessibleBoards,
  getAllUserInBoard,
  deleteManyBoard
}
