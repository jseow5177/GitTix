import request from 'supertest'
import { app } from '../../app'
import { ObjectID } from 'mongodb'
import { Ticket } from '../../models/ticket'

describe('test update a ticket route', () => {

  it('returns a 404 if the ticket id does not exist', async () => {
    const id = new ObjectID()
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
    const id = new ObjectID()
    await request(app)
      .put(`/api/tickets/${id}`)
      .send({
        title: 'A Title',
        price: 20
      })
      .expect(401)
  })

  it('returns a 401 if the user does not own the ticket', async () => {
    const oldTitle = 'Old title'
    const oldPrice = 20

    const newTitle = 'New title'
    const newPrice = 200

    // Create a ticket
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signup())
      .send({
        title: oldTitle,
        price: oldPrice
      })

    const ticketId = response.body.id

    // Tries to update the ticket with a different user
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
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
    const cookie = global.signup()

    // Create a ticket
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'A Title',
        price: 20
      })
    
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: '', // Invalid title
        price: 20
      })
      .expect(400)
  })

  it('returns a 400 if the user provides an invalid price', async () => {
    const cookie = global.signup()

    // Create a ticket
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'A Title',
        price: 20
      })
    
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'A Title',
        price: -200 // Invalid price
      })
      .expect(400)
  })

  it('updates ticket when input is valid, returns a 200', async () => {
    const cookie = global.signup()
    const newTitle = 'New Title'
    const newPrice = 100

    // Create a ticket
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'A Title',
        price: 20
      })

    const ticketId = response.body.id

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: newTitle,
        price: newPrice
      })
      .expect(200)
    
    const ticket = await Ticket.findById(ticketId)

    expect(ticket.title).toEqual(newTitle)
    expect(ticket.price).toEqual(newPrice)
  })

})