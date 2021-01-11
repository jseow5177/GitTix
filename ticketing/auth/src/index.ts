import mongoose from 'mongoose'

import { app } from './app'
import { AuthServiceError } from './errors/auth-service-error'

const PORT = 3000

const start = async () => {
  // Ensure that the JWT_KEY is present in the environment variable before starting the application
  if (!process.env.JWT_KEY) {
    throw new Error('JWT secret key is not defined')
  }

  try {
    // Connect to MongoDB instance on service
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to MongoDB!')
  } catch (err) {
    throw new AuthServiceError(500, 'Error connecting to MongoDB')
  }

  // Listen to port
  app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}!`)
  })
}

start()