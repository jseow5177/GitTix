import { Message } from 'node-nats-streaming'
import { Listener, OrderCreatedEvent, Subjects } from '@gittix-js/common'
import { queueGroupName } from './queueGroupName'
import { Order } from '../../models/order'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  readonly queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const newOrder = Order.build({
      id: data.id,
      version: data.version,
      userId: data.userId,
      status: data.status,
      price: data.ticket.price 
    })

    await newOrder.save()

    msg.ack()
  }
}