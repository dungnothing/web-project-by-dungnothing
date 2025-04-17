import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,

  LOCAL_APP_HOST: process.env.LOCAL_APP_HOST,
  LOCAL_APP_PORT: process.env.LOCAL_APP_PORT,

  BUILD_MODE: process.env.BUILD_MODE,
  JWT_SECRET: process.env.JWT_SECRET,

  AUTHOR: process.env.AUTHOR
}