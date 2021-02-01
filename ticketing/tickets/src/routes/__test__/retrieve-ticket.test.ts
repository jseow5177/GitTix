import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'
import { Ticket } from '../../models/ticket'

describe('test retrieve a ticket route', () => {

  it('returns a 404 if ticket is not found', async () => {
    const fakeId = mongoose.Types.ObjectId()
    await request(app)
      .get(`/api/tickets/${fakeId}`)
      .send()
      .expect(404)
  })

  it ('returns the ticket if it is found', async () => {
    const title = 'Ticket title'
    const price = 10.00
    const userId = '007'

    const ticket = Ticket.build({ title, price, userId })
    await ticket.save()

    const response = await request(app)
      .get(`/api/tickets/${ticket._id}`)
      .send()
      .expect(200)

    expect(response.body.title).toEqual(title)
    expect(response.body.price).toEqual(price)
  })

})