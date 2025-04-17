import express from 'express'
import upload from '~/middlewares/upload'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Route không cần xác thực token
Router.route('/register')
  .post(userValidation.register, userController.register)

Router.route('/login')
  .post(userValidation.login, userController.login)

Router.route('/forgotPassword')
  .post(userController.forgotPassword)

Router.route('/refreshToken')
  .post(userController.refreshToken)

// Route cần xác thực token
Router.route('/getUserData')
  .get(authMiddleware.verifyToken, userController.getUserData)

Router.route('/updateName')
  .put(authMiddleware.verifyToken, userValidation.updateName, userController.updateName)

Router.route('/updatePassword')
  .put(authMiddleware.verifyToken, userValidation.updatePassword, userController.updatePassword)

// Thêm middleware `upload.single('avatar')` để xử lý upload ảnh
Router.route('/updateAvatar')
  .put(authMiddleware.verifyToken, upload.single('avatar'), userController.updateAvatar)

Router.route('/upgradeVip')
  .put(authMiddleware.verifyToken, userValidation.upgradeVip, userController.upgradeVip)

Router.route('/deleteAccount')
  .delete(authMiddleware.verifyToken, userController.deleteAccount)

Router.route('/starBoard')
  .get(authMiddleware.verifyToken, userController.getStarBoard)

Router.route('/starBoard/:boardId')
  .put(authMiddleware.verifyToken, userController.addStarBoard)
  .delete(authMiddleware.verifyToken, userController.removeStarBoard)

export const userRoutes = Router
