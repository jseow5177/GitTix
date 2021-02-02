import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { TicketCreatedEvent } from '@gittix-js/common'
import { TicketCreatedListener } from '../ticket-created-listener'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'

describe('test ticket created listener', () => {

  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client)

  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'A ticket',
    price: 123,
    userId: '123'
  }

  // Create a fake message object
  // @ts-ignore
  const msg: Message = { ack: jest.fn() }

  it('creates a ticket and acks the message', async () => {

    // Calls the onMessage function with the data object and message object
    await listener.onMessage(data, msg)
    
    const ticket = await Ticket.findById(data.id)
    expect(ticket).toBeDefined()
    expect(ticket.title).toEqual(data.title)
    expect(ticket.price).toEqual(data.price)

    // Acks the message
    expect(msg.ack).toHaveBeenCalledTimes(1)
  })

})