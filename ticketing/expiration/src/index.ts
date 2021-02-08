import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listener'

const start = async () => {
  /**
   * Ensure that the JWT_KEY is present in the environment variable before starting the application
  */
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
    
  } catch (err) {
    console.log(err)
  }

}

start()