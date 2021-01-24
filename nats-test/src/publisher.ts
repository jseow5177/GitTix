import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created/ticket-created-publisher'

console.clear()

const stan = nats.connect('gitix-dev', 'publisher_id', {
  url: 'http://localhost:4222' // connection url
})

stan.on('connect', () => {
  console.log('Publisher connected to NATS')

  // Message
  const data = { id: '123', title: 'concert', price: 20 }

  const publisher = new TicketCreatedPublisher(stan)

  publisher.publish(data)
})


