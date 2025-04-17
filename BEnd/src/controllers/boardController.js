import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
// import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    // Dieu huong du lieu sang tang Service
    const userId = req.user ? req.user.userId : null
    const createdBoard = await boardService.createNew(req.body, userId)
    // Co ket qua thi tra ve Client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) { next(error) }
}

const deleteBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const userId = req.user ? req.user.userId : null
    const deletedBoard = await boardService.deleteBoard(boardId, userId)
    res.status(StatusCodes.OK).json(deletedBoard)
  } catch (error) { next(error) }
}

const deleteManyBoard = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.userId : null
    const deletedBoards = await boardService.deleteManyBoard(userId)
    res.status(StatusCodes.OK).json(deletedBoards)
  } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const userId = req.user ? req.user.userId : null
    const board = await boardService.getDetails(boardId, userId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}

const getAllAccessibleBoards = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.userId : null
    const boards = await boardService.getAllAccessibleBoards(userId)
    res.status(StatusCodes.OK).json(boards)
  } catch (error) { next(error) }
}

const getAllUserInBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const users = await boardService.getAllUserInBoard(boardId)
    res.status(StatusCodes.OK).json(users)
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.update(boardId, req.body)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

// Ham cap nhat thuoc tinh title, visibility
const updateTitle = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const userId = req.user ? req.user.userId : null
    const updatedBoard = await boardService.updateTitle(boardId, req.body, userId)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}

const updateVisibility = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const userId = req.user ? req.user.userId : null
    const updatedBoard = await boardService.updateVisibility(boardId, req.body, userId)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}

const updateBoardState = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const userId = req.user ? req.user.userId : null
    const boardState = req.body
    const updatedBoard = await boardService.updateBoardState(boardId, boardState, userId)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}

// Ham quan ly thanh vien cua board
const addMemberToBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const email = req.body.email
    const userId = req.user ? req.user.userId : null
    const updatedBoard = await boardService.addMemberToBoard(boardId, email, userId)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}

const removeMemberFromBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.removeMemberFromBoard(boardId, req.body)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getDetails,
  deleteBoard,
  update,
  moveCardToDifferentColumn,
  updateTitle,
  updateVisibility,
  getAllAccessibleBoards,
  updateBoardState,
  addMemberToBoard,
  removeMemberFromBoard,
  getAllUserInBoard,
  deleteManyBoard
}
