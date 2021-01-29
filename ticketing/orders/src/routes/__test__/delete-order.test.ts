import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { OrderStatus } from '@gittix-js/common'
import { Order } from '../../models/order'

describe('test delete order route', () => {

  it('marks an order as cancelled', async () => {
    // Create a ticket with Ticket model
    const ticket = Ticket.build({
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

    // Make a request to cancel the order
    const response = await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(204)

    const updatedOrder = await Order.findById(order.id)
    
    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled)
    
  })

  it.todo('emits an delete event')

})