import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { OrderStatus } from '@gittix-js/common'
import { Order } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper' // Mocked nats wraper

describe('test delete order route', () => {

  it('marks an order as cancelled and emits an order cancelled event', async () => {
    // Create a ticket with Ticket model
    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: 'A Ticket',
      price: 20
    })
    await ticket.save()

    const user = global.signup()

    // Make a request to create an order
    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201)

    jest.clearAllMocks()

    // Make a request to cancel the order
    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(204)

    const updatedOrder = await Order.findById(order.id)
    
    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled)
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1)
    
  })

})