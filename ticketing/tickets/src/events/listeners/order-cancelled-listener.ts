import { Message } from 'node-nats-streaming'
import { Listener, OrderCancelledEvent, Subjects } from '@gittix-js/common'
import { queueGroupName } from './queueGroupName'
import { Ticket } from '../../models/ticket' 
import { TicketUpdatedPublisher } from '../publishers/ticket-update-publisher'

export class OrderCancelledListener extends Listener <OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  readonly queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order is cancelling
    const ticket = await Ticket.findById(data.ticket.id)

    // If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ orderId: undefined })

    // Save the ticket
    await ticket.save()

    // Emit ticket updated event so that orders service can increment the ticket version
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId
    })

    // Ack the message
    msg.ack()
  }
}