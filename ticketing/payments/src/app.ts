import 'express-async-errors' // Allow async errors to use throw instead of passing into next()
import express from 'express'
import cookieSession from 'cookie-session'
import { json, urlencoded } from 'body-parser'

import { errorHandler, NotFoundError, currentUser } from '@gittix-js/common'

const app = express()

// A app configuration for Express server that is running behind a proxy (in this case, ingress-nginx)
// Tells Express to trust the traffic forwarded by the proxy
// https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', true)

app.use(json()) // Parse json data
app.use(urlencoded({ extended: true })) // Parse url params with the qs library

app.use(
  cookieSession({
    // cookie content will not be encrypted
    signed: false,
    // cookie is only to be sent over HTTPS when not in test environment
    secure: process.env.NODE_ENV !== 'test'
  })
)

// currentUser middleware
// requireAuth middleware will be chained independently at routes that are private
app.use(currentUser)

// Handle 404 errors
app.all('*', () => {
  throw new NotFoundError()
})

// Attach error handling middleware
app.use(errorHandler)

export { app }