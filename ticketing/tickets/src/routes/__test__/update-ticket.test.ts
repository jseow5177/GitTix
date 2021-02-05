import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

describe('test update a ticket route', () => {

  let cookie: string[]
  let ticketId: string

  const oldTitle = 'Old title'
  const oldPrice = 20

  beforeEach(async () => {
    cookie = global.signup()

    // Create a ticket
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: oldTitle,
        price: oldPrice
      })

    ticketId = response.body.id

    jest.clearAllMocks()
  })

  it('returns a 404 if the ticket id does not exist', async () => {
    const id = mongoose.Types.ObjectId()
    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signup())
      .send({
        title: 'A Title',
        price: 20
      })
      .expect(404)
  })

  it('returns a 401 if the user is not authenticated', async () => {
    const id = mongoose.Types.ObjectId()
    await request(app)
      .put(`/api/tickets/${id}`)
      .send({
        title: 'A Title',
        price: 20
      })
      .expect(401)
  })

  it('returns a 401 if the user does not own the ticket', async () => {
    const newTitle = 'New title'
    const newPrice = 200

    // Tries to update the ticket with a different user
    await request(app)
      .put(`/api/tickets/${ticketId}`)
      .set('Cookie', global.signup())
      .send({
        title: newTitle,
        price: newPrice
      })
      .expect(401)

    const ticket = await Ticket.findById(ticketId)

    expect(ticket.title).toEqual(oldTitle)
    expect(ticket.price).toEqual(oldPrice)
  })

  it('returns a 400 if the user provides an invalid title', async () => {    
    await request(app)
      .put(`/api/tickets/${ticketId}`)
      .set('Cookie', cookie)
      .send({
        title: '', // Invalid title
        price: 20
      })
      .expect(400)
  })

  it('returns a 400 if the user provides an invalid price', async () => {    
    await request(app)
      .put(`/api/tickets/${ticketId}`)
      .set('Cookie', cookie)
      .send({
        title: 'A Title',
        price: -200 // Invalid price
      })
      .expect(400)
  })

  it('returns a 400 if ticket is reserved', async () => {
    const ticket = await Ticket.findById(ticketId)
    ticket.set({ orderId: '123' }) // Add a defined order id
    await ticket.save()

    await request(app)
      .put(`/api/tickets/${ticketId}`)
      .set('Cookie', cookie)
      .send({
        title: 'A Title',
        price: 200
      })
      .expect(400)
  })

  it('updates ticket and publishes event when input is valid, returns a 200', async () => {
    const newTitle = 'New Title'
    const newPrice = 100

    await request(app)
      .put(`/api/tickets/${ticketId}`)
      .set('Cookie', cookie)
      .send({
        title: newTitle,
        price: newPrice
      })
      .expect(200)
    
    const ticket = await Ticket.findById(ticketId)

    expect(ticket.title).toEqual(newTitle)
    expect(ticket.price).toEqual(newPrice)

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1)
  })

})