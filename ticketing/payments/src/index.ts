import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { DatabaseConnectionError } from '@gittix-js/common'
import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'

const PORT = 3000

const start = async () => {
  console.log('Starting app...')
  /**
   * Ensure that the JWT_KEY is present in the environment variable before starting the application
  */
  if (!process.env.JWT_KEY) {
    throw new Error('JWT secret key is not defined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID is not defined')
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL is not defined')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID is not defined')
  }

  try {
    // Connect to NATS
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID, 
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )
    // Quit program when NATS shut down
    natsWrapper.client.on('close', () => {
      console.log('NATS disconnected!')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()

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