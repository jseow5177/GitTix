import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order } from '../../models/order'
import { OrderStatus } from '@gittix-js/common'
import { natsWrapper } from '../../nats-wrapper' // Mocked nats wraper

describe('test create new order route', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(async () => {
    await Ticket.deleteMany({})
    await Order.deleteMany({})
  })

  it('returns an error if the ticket does not exist', async () => {
    const ticketId = mongoose.Types.ObjectId()
    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signup())
      .send({ ticketId })
      .expect(404)
  })

  it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: 'A Ticket',
      price: 20
    })
    await ticket.save()

    const order = Order.build({
      userId: '123',
      status: OrderStatus.Created,
      expiresAt: new Date(),
      ticket
    })
    await order.save()

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signup())
      .send({ ticketId: ticket.id })
      .expect(400)
  })

  it('successfully reserves a ticket and emits an order created event', async () => {
    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: 'A Ticket',
      price: 20
    })
    await ticket.save()

    const response = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signup())
      .send({ ticketId: ticket.id })
      .expect(201)

    expect(response.body.ticket.title).toEqual(ticket.title)
    expect(response.body.ticket.price).toEqual(ticket.price)

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1)
  })

})