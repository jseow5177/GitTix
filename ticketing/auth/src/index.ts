import express from 'express'
import 'express-async-errors'
import mongoose from 'mongoose'
import { json, urlencoded } from 'body-parser'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'

import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

const PORT = 3000
const app = express()

app.use(json())
app.use(urlencoded({ extended: true }))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

// Handle 404 errors
app.all('*', () => {
  throw new NotFoundError()
})

// Attach error handling middleware
app.use(errorHandler)

const start = async () => {
  try {
    // Connect to MongoDB instance on service
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to MongoDB!')
  } catch (err) {
    console.error(err)
  }

  // Listen to port
  app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}!`)
  })
}

start()