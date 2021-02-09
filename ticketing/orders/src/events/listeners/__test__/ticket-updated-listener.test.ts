import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { TicketUpdatedEvent } from '@gittix-js/common'
import { TicketUpdatedListener } from '../ticket-updated-listener'
import { Ticket, TicketDoc } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'

describe('test ticket updated listener', () => {

  let listener: TicketUpdatedListener
  let data: TicketUpdatedEvent['data']
  let msg: Message
  let ticket: TicketDoc

  const oldTitle = 'Old title'
  const oldPrice = 20

  const newTitle = 'New title'
  const newPrice = 123

  beforeEach(async () => {
    // Create a ticket
    ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: oldTitle,
      price: oldPrice
    })
    await ticket.save()

    // Create an instance of the listener
    listener = new TicketUpdatedListener(natsWrapper.client)

    // Create a fake data event
    data = {
      version: ticket.version + 1,
      id: ticket.id,
      title: newTitle,
      price: newPrice,
      userId: '123'
    }

    // Create a fake message object
    // @ts-ignore
    msg = { ack: jest.fn() }
  })

  it('updates a ticket and acks the message', async () => {
    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(data.id)

    expect(updatedTicket!.title).toEqual(newTitle)
    expect(updatedTicket!.price).toEqual(newPrice)
    expect(updatedTicket!.version).toEqual(ticket.version + 1)

    expect(msg.ack).toHaveBeenCalledTimes(1)
  })

  it('throws error if event is out of order', async () => {
    data.version = 100

    expect(async () => await listener.onMessage(data, msg)).rejects.toThrow()

    const notUpdatedTicket = await Ticket.findById(data.id)
    expect(notUpdatedTicket!.title).toEqual(oldTitle)
    expect(notUpdatedTicket!.price).toEqual(oldPrice)
    expect(notUpdatedTicket!.version).toEqual(ticket.version)

    expect(msg.ack).toHaveBeenCalledTimes(0)
  })

})