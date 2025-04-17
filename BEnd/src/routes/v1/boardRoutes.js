import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.use(authMiddleware.verifyToken)

Router.route('/accessible')
  .get(boardController.getAllAccessibleBoards)

Router.route('/')
  .post(boardValidation.createNew, boardController.createNew)
  .delete(boardController.deleteManyBoard)

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)

Router.route('/:id/title')
  .put(boardValidation.updateTitle, boardController.updateTitle)

Router.route('/:id/visibility')
  .put(boardValidation.updateVisibility, boardController.updateVisibility)

Router.route('/:id/state')
  .put(boardValidation.updateBoardState, boardController.updateBoardState)

Router.route('/:id/delete')
  .delete(boardValidation.deleteBoard, boardController.deleteBoard)

// API ho tro them thanh vien vao board
Router.route('/:id/members')
  .post(boardValidation.addMemberToBoard, boardController.addMemberToBoard)
  .delete(boardValidation.removeMemberFromBoard, boardController.removeMemberFromBoard)
  .get(boardController.getAllUserInBoard)

// API ho tro di chuyen card giua cac column khac nhau trong mot board
Router.route('/supports/moving_card')
  .put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoutes = Router
