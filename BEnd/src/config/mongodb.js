
import { env } from '~/config/environment'
import { MongoClient, ServerApiVersion } from 'mongodb'

let trelloDatabaseInstance = null

// Khoi tao 1 doi tuong Client de ket noi den MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  // serverApi chi co tu phien ban MongoDB 5.0.0 tro len, co the khong dung, nhung neu dung thi phai chi dinh 1 Stable API Version cua mongodb
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  },
  tls: true,
  tlsInsecure: true
})

// Kết nối tới Database
export const CONNECT_DB = async () => {
  // Goi ket noi toi MongoDB Atlats voi URI da khai bao trong than cua clientInstance
  await mongoClientInstance.connect()

  // Ket noi thanh cong thi lay Database theo ten va gan nguoc no lai vao bien trelloDatabaseInstance o tren
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)

}

// Dong ket noi toi MongoDB khi can
export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}


// Trong nay (khong co async) co nhiem vu export cai Trello Database Intance sau khi da connect thanh cong toi MongoDB de chung ta su dung o nhieu noi khac nhau trong code.
// Phai dam bao chi goi cai getDB nay sau khi da ket noi thanh cong toi MongoDB
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Ket noi toi Database truoc da')
  return trelloDatabaseInstance
}

