import { Message } from 'node-nats-streaming'
import { Listener, Subjects, OrderCancelledEvent, OrderStatus } from '@gittix-js/common'
import { queueGroupName } from './queueGroupName'
import { Order } from '../../models/order'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  readonly queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    /**
     * Technically, OCC with version number is not needed here because:
     * 
     * 1. If a Cancelled event arrives and the ticket is not found, the Created event must not
     *  have been processed correctly.
     * 2. There are no other intermediary events between Created and Cancelled (e.g. updated).
     * 
     * OCC will be used to future-proof our application.
     */
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1
    })

    if (!order) {
      throw new Error('Order not found')
    }

    order.set('status', OrderStatus.Cancelled)
    await order.save()

    msg.ack()
  }
}