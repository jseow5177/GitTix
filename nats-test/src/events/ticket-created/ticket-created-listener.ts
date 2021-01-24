import { Message } from 'node-nats-streaming'
import { Listener } from '../base-listener'
import { TicketCreatedEvent } from './ticket-created-event'
import { Subjects } from '../subjects'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // 'readonly' (like 'final' in Java) prevents a class property from being changed
  // This is a way of telling TypeScript that the type of 'subject' will not change
  readonly subject = Subjects.TicketCreated
  queueGroupName = 'payments-service'

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data: ')

    console.log('Id: ', data.id)
    console.log('Title: ', data.title)
    console.log('Price: ', data.price)

    msg.ack() // Mark message as successfully parsed
  }
}