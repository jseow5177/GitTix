import 'express-async-errors' // Allow async errors to use throw instead of passing into next()
import express from 'express'
import cookieSession from 'cookie-session'
import { json, urlencoded } from 'body-parser'

import { errorHandler, NotFoundError, currentUser } from '@gittix-js/common'

import { createOrderRouter } from './routes/new-order'
import { getOrdersRouter } from './routes/get-orders'
import { deleteOrderRouter } from './routes/delete-order'
import { retrieveOrderRouter } from './routes/retrieve-order' 

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
    secure: false
  })
)

// currentUser middleware
// requireAuth middleware will be chained independently at routes that are private
app.use(currentUser)

app.use(createOrderRouter)
app.use(getOrdersRouter)
app.use(retrieveOrderRouter)
app.use(deleteOrderRouter)

// Handle 404 errors
app.all('*', () => {
  throw new NotFoundError()
})

// Attach error handling middleware
app.use(errorHandler)

export { app }