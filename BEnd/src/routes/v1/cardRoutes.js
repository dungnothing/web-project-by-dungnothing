import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import upload from '~/middlewares/upload'

const Router = express.Router()

Router.use(authMiddleware.verifyToken)

Router.route('/')
  .post(cardValidation.createNew, cardController.createNew)

Router.route('/:cardId')
  .put(cardValidation.updateCard, cardController.updateCard)

Router.route('/:cardId/updateCardBackground')
  .put(upload.single('cardBackground'), cardController.updateCardBackground)

Router.route('/:cardId/cancel')
  .put(cardController.cancelEndTime)

Router.route('/:cardId/joinCard')
  .post(cardController.joinCard)

Router.route('/:cardId/leaveCard')
  .delete(cardController.leaveCard)

Router.route('/:cardId/getMember')
  .get(cardController.getMember)

export const cardRoutes = Router
