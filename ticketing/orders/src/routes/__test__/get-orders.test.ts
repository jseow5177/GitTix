import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'A title',
    price: 20
  })
  await ticket.save()

  return ticket
}

describe('test get orders route', () => {

  it('fetches orders for a particular user', async () => {
    // Create three tickets
    const ticketOne = await buildTicket()
    const ticketTwo = await buildTicket()
    const ticketThree = await buildTicket()

    const userOne = global.signup()
    const userTwo = global.signup()

    // Create one order as User #1
    await request(app)
      .post('/api/orders')
      .set('Cookie', userOne)
      .send({ ticketId: ticketOne.id })
      .expect(201)

    // Create two orders as User #2
    const { body: orderOne } = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ ticketId: ticketTwo.id })
      .expect(201)
    const { body: orderTwo } = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ ticketId: ticketThree.id })
      .expect(201)

    // Make request to get orders for User #2
    const response = await request(app)
      .get('/api/orders')
      .set('Cookie', userTwo)
      .send()
      .expect(200)

    // Assert we only get the orders for User #2
    expect(response.body.length).toEqual(2)
    expect(response.body[0].id).toEqual(orderOne.id)
    expect(response.body[1].id).toEqual(orderTwo.id)
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id)
    expect(response.body[1].ticket.id).toEqual(ticketThree.id)
  })

})