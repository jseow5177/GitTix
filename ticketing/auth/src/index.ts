import mongoose from 'mongoose'

import { app } from './app'
import { DatabaseConnectionError } from '@gittix-js/common'

const PORT = 3000

const start = async () => {
  console.log('Starting auth service...')  
  
  // Ensure that the JWT_KEY is present in the environment variable before starting the application
  if (!process.env.JWT_KEY) {
    throw new Error('JWT secret key is not defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined')
  }

  try {
    // Connect to MongoDB instance on service
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log(`Connected to MongoURI ${process.env.MONGO_URI}`)
  } catch (err) {
    throw new DatabaseConnectionError()
  }

  // Listen to port
  app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}!`)
  })
}

start()