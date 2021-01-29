import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

describe('test retrieve order route', () => {

  it('fetches the order correctly for a user', async () => {
    // Create a ticket
    const ticket = Ticket.build({
      title: 'A title',
      price: 20
    })
    await ticket.save()

    const user = global.signup()

    // Make a request to build an order with the ticket
    const { body: createdOrder} = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201)

    // Make a request to fetch the order
    const { body: fetchedOrder } = await request(app)
      .get(`/api/orders/${createdOrder.id}`)
      .set('Cookie', user)
      .send()
      .expect(200)

    expect(createdOrder.id).toEqual(fetchedOrder.id)
  })

  it('returns 401 if attempts to retrieve other user order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
      title: 'A title',
      price: 20
    })
    await ticket.save()

    const userOne = global.signup()
    const userTwo = global.signup()

    // Make a request to build an order of userOne with the ticket
    const { body: createdOrder} = await request(app)
      .post('/api/orders')
      .set('Cookie', userOne)
      .send({ ticketId: ticket.id })
      .expect(201)

    // userTwo makes a request to fetch the order
    await request(app)
      .get(`/api/orders/${createdOrder.id}`)
      .set('Cookie', userTwo)
      .send()
      .expect(401)
  })

})