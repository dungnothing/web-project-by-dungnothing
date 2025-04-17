/* eslint-disable no-console */

import express from 'express'
import exitHook from 'async-exit-hook'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import { env } from './config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()
  const server = createServer(app) // Tạo HTTP server
  const io = new Server(server, {
    cors: {
      origin: '*', // Cho phép tất cả domain (có thể tùy chỉnh)
      methods: ['GET', 'POST']
    }
  })

  app.use(cors())
  app.use(express.json())

  // API v1
  app.use('/v1', APIs_V1)

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  // Lắng nghe sự kiện kết nối từ client
  io.on('connection', (socket) => {
    console.log(`Người dùng kết nối: ${socket.id}`)

    socket.on('message', (msg) => {
      console.log(`Tin nhắn từ client: ${msg}`)
      io.emit('message', msg) // Gửi tin nhắn đến tất cả client
    })

    socket.on('disconnect', () => {
      console.log(`Người dùng ngắt kết nối: ${socket.id}`)
    })
  })

  if (env.BUILD_MODE === 'production') {
    server.listen(process.env.PORT, () => {
      console.log(`3. Production: Server chạy tại Port ${process.env.PORT}`)
    })
  } else {
    server.listen(env.LOCAL_APP_PORT, env.LOCAL_APP_HOST, () => {
      console.log(`3. Dev: Server chạy tại Host ${env.LOCAL_APP_HOST} và Port ${env.LOCAL_APP_PORT}`)
    })
  }

  exitHook(() => {
    console.log('4. Shutting down')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB')
  })
}

// Chỉ khi kết nối Database thành công mới Start Server
(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Altas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
