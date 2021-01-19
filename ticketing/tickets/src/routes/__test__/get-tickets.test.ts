import request from 'supertest'
import { app } from '../../app'

import { Ticket } from '../../models/ticket'

const createTicket = () => {
  const ticket = Ticket.build({ title: 'A Ticket', price: 20, userId: '001' })
  return ticket.save()
}

describe('test get tickets route', () => {

  it('can fetch a list of tickets', async () => {
    await createTicket()
    await createTicket()
    await createTicket()

    const response = await request(app)
      .get('/api/tickets')
      .send()
    
    expect(response.status).toEqual(200)
    expect(response.body.length).toEqual(3)
  })

})