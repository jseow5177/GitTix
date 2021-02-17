import mongoose from 'mongoose'
import { OrderStatus, ExpirationCompleteEvent } from '@gittix-js/common'
import { Message } from 'node-nats-streaming'
import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/order'
import { Ticket } from '../../../models/ticket'

describe('Test expiration complete listener', () => {

  let orderId: string
  let listener: ExpirationCompleteListener 
  let data: ExpirationCompleteEvent['data']
  let msg: Message

  beforeEach(async () => {
    // Create a ticket
    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: 'A ticket',
      price: 123
    })
    await ticket.save()

    // Create an order
    const order = Order.build({
      userId: '123',
      status: OrderStatus.Created,
      expiresAt: new Date(),
      ticket: ticket.id
    })
    await order.save()

    orderId = order.id

    listener = new ExpirationCompleteListener(natsWrapper.client)

    data = {
      orderId: order.id
    }

    // @ts-ignore
    msg = {
      ack: jest.fn()
    }
  })

  test('sets order to cancelled, emit order cancelled event and ack message', async () => {
    await listener.onMessage(data, msg)

    const expiredOrder = await Order.findById(data.orderId)

    expect(expiredOrder!.status).toEqual(OrderStatus.Cancelled)

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1)

    // Get the first argument of the first call to natsWrapper.client.publish
    const expirationEventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(expirationEventData.id).toEqual(expiredOrder!.id)

    expect(msg.ack).toHaveBeenCalledTimes(1)
  })

  test('throw error when order not found', async () => {
    const existingOrderId = data.orderId
    const order = await Order.findById(existingOrderId)

    data.orderId = mongoose.Types.ObjectId().toHexString()
    expect(async () => await listener.onMessage(data, msg)).rejects.toThrow()

    const expiredOrder = await Order.findById(existingOrderId)

    expect(expiredOrder!.status).toEqual(order!.status)
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(0)
    expect(msg.ack).toHaveBeenCalledTimes(0)
  })


})