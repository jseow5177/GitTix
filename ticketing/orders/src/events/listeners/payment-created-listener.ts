import { Listener, Subjects, PaymentCreatedEvent, OrderStatus } from '@gittix-js/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
  readonly queueGroupName = queueGroupName

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    /**
     * Order has been paid!
     * 
     * There might be a need to emit an OrderUpdated event to increment version number
     *  of order records in other services.
     * However, it won't be done here because:
     * 1. Our application does not support direct order updates.
     * 2. There aren't any more possible updates to an order that has already been completed.
     */
    order.set({ status: OrderStatus.Complete })
    await order.save()

    msg.ack()
  }
}