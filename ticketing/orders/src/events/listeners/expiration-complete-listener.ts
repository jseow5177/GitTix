import { Message } from 'node-nats-streaming'
import { Listener, ExpirationCompleteEvent, Subjects, OrderStatus } from '@gittix-js/common'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
  readonly queueGroupName = queueGroupName

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const expiredOrder = await Order.findById(data.orderId).populate('ticket')

    if (!expiredOrder) {
      throw new Error('Order not found')
    }

    // Order has been paid and completed
    if (expiredOrder.status === OrderStatus.Complete) {
      return msg.ack()
    }

    expiredOrder.set({ status: OrderStatus.Cancelled })

    await expiredOrder.save()

    const publisher = new OrderCancelledPublisher(this.client)
    await publisher.publish({
      id: expiredOrder.id,
      version: expiredOrder.version,
      ticket: {
        id: expiredOrder.ticket.id
      }
    })

    msg.ack()
  }
}