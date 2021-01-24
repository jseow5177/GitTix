import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { TicketCreatedListener } from './events/ticket-created/ticket-created-listener'

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

  const listener = new TicketCreatedListener(stan)

  listener.listen()
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