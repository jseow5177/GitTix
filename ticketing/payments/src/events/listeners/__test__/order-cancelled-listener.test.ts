import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderCancelledListener } from '../order-cancelled-listener'
import { OrderCancelledEvent, OrderStatus } from '@gittix-js/common'
import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'

describe('test order cancelled listener', () => {

  let listener: OrderCancelledListener
  let data: OrderCancelledEvent['data']
  let msg: Message
  const orderId = mongoose.Types.ObjectId().toHexString()

  beforeEach(async () => {
    const order = Order.build({
      id: orderId,
      version: 0,
      userId: '123',
      status: OrderStatus.Created,
      price: 20
    })
    await order.save()

    listener = new OrderCancelledListener(natsWrapper.client)

    data = {
      id: orderId,
      version: order.version + 1,
      ticket: {
        id: '123'
      }
    }

    // @ts-ignore
    msg = {
      ack: jest.fn()
    }
  })

  it('cancels an order', async () => {
    await listener.onMessage(data, msg)

    const order = await Order.findById(orderId)

    expect(order!.version).toEqual(data.version)
    expect(order!.status).toEqual(OrderStatus.Cancelled)
    expect(msg.ack).toHaveBeenCalledTimes(1)
  })
})