import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()

const stan = nats.connect('gitix-dev', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
})

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  // Catches close event
  stan.on('close', () => {
    console.log('NATS connection closed!')
    process.exit()
  })

  const options = stan.subscriptionOptions()
    .setManualAckMode(true) // Requires the listener to manually acknowledge the receive of an event
    .setDeliverAllAvailable()
    .setDurableName('listener-service')

  let subscription = stan.subscribe('ticket:created', 'listenerQueueGroup', options)

  subscription.on('message', (msg: Message) => {
    console.log('Message received')
    /**
     * getSubject():  Returns the subject associated with this Message.
     * getSequence(): Returns the sequence number of the message in the stream.
     * getData():     Returns the data associated with the message payload. If the stanEncoding is not 
     *                set to 'binary', a string is returned.
     */
    const data = msg.getData()
    const sequence = msg.getSequence()
    console.log(`Received event #${sequence} with data: ${data}`)

    msg.ack()
  })

})

/**
 * Catches the interrupt signal
 * The terminal sends it to the foreground process when the user presses ctrl-c.
 */
process.on('SIGINT', () => {
  console.log('SIGINT...')
  stan.close() // Tells NATS that it is closing
})

/**
 * Catches the termination signal
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM...')
  stan.close()
})