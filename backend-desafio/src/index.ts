import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

import userRoutes from './routes/menu'

const LOGMSG = '⚡️[Paketá Credito Live-Coding BoilerPlate]:'

const defaultConfig = {
  MONGO_URL:
    'mongodb://root:pwd@localhost:27018/desafio-menu?authSource=admin&readPreference=primary&directConnection=true&ssl=false',
  HOST: 'localhost',
  PORT: '8081',
}

const HOST = process.env.HOST || defaultConfig.HOST
const PORT = process.env.PORT || defaultConfig.PORT

mongoose.connect(process.env.MONGO_URL || defaultConfig.MONGO_URL, {}, err => {
  const msg = err
    ? `${LOGMSG} Failed to connect to MongoDB: ${err}`
    : `${LOGMSG} MongoDB connection established successfully`
  console.log(msg)
})

const app = express()
app.use(express.json())
app.use('/menus', userRoutes)
app.listen(PORT, () => {
  console.log(`${LOGMSG} Server is running at ${HOST}:${PORT}`)
})
