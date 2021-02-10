import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderCreatedEvent, OrderStatus } from '@gittix-js/common'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'
import { Order } from '../../../models/order'

describe('test order created listener', () => {

  let listener: OrderCreatedListener
  let data: OrderCreatedEvent['data']
  let msg: Message

  const orderId = mongoose.Types.ObjectId().toHexString()

  beforeEach(() => {
    listener = new OrderCreatedListener(natsWrapper.client)
    data = {
      id: orderId,
      version: 0,
      status: OrderStatus.Created,
      userId: '123',
      expiresAt: new Date().toUTCString(),
      ticket: {
        id: '123',
        price: 10
      }
    }

    // @ts-ignore
    msg = {
      ack: jest.fn()
    }
  })

  test('creates a new order', async () => {
    await listener.onMessage(data, msg)

    const createdOrder = await Order.findById(orderId)
    expect(createdOrder).toBeDefined()
    expect(msg.ack).toHaveBeenCalledTimes(1)
  })
})