import 'express-async-errors' // Allow async errors to use throw instead of passing into next()
import express from 'express'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
import { json, urlencoded } from 'body-parser'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'

import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

const PORT = 3000
const app = express()

// A app configuration for Express server that is running behind a proxy (in this case, ingress-nginx)
// Tells Express to trust the traffic forwarded by the proxy
// https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', true)

app.use(json()) // Parse json data
app.use(urlencoded({ extended: true })) // Parse url params with the qs library

app.use(
  cookieSession({
    signed: false, // cookie content will not be encrypted
    secure: true // cookie is only to be sent over HTTPS
  })
)

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
    console.error(err)
  }

  // Listen to port
  app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}!`)
  })
}

start()