import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher'
import { natsWrapper } from '../nats-wrapper'

// The Job to be queued
interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST
  }
})

expirationQueue.process(async (job) => {
  // Publish event on expired order
  const publisher = new ExpirationCompletePublisher(natsWrapper.client)
  publisher.publish({
    orderId: job.data.orderId
  })
})

export { expirationQueue }