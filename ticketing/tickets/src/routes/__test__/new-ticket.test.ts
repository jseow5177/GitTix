import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper' // The mock implementation

describe('test create new ticket route', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has a route handler listening to /api/tickets for post request', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .send({})
    expect(response.status).not.toEqual(404)
  })

  it('can only be accessed if the user is signed in', async () => {
    await request(app)
      .post('/api/tickets')
      .send({})
      .expect(401)
  })

  it('returns an error if an invalid title is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signup())
      .send({})
      .expect(400)
  })

  it('returns an error if an invalid price is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signup())
      .send({ title: 'Ticket title', price: '' })
      .expect(400)
  })

  it('creates a ticket with valid inputs and publishes event', async () => {
    const oldTickets = await Ticket.find({})
    expect(oldTickets.length).toEqual(0)

    const ticketTitle = 'Ticket title'
    const ticketPrice = 10.00

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signup())
      .send({ title: ticketTitle, price: ticketPrice })
      .expect(201)

    const newTickets = await Ticket.find({})
    expect(newTickets.length).toEqual(1)
    expect(newTickets[0].title).toEqual(ticketTitle)
    expect(newTickets[0].price).toEqual(ticketPrice)

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1)
  })
  
})