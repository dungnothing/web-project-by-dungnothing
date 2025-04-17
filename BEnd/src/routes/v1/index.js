import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from '~/routes/v1/boardRoutes'
import { columnRoutes } from '~/routes/v1/columnRoutes'
import { cardRoutes } from '~/routes/v1/cardRoutes'
import { userRoutes } from '~/routes/v1/userRoutes'

const Router = express.Router()

// Check API V1 status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ messgae: 'API V1 are ready. ' })
})

// Board API
Router.use('/boards', boardRoutes)

// Column API
Router.use('/columns', columnRoutes)

// Card API
Router.use('/cards', cardRoutes)

// Auth API
Router.use('/users', userRoutes)


export const APIs_V1 = Router
