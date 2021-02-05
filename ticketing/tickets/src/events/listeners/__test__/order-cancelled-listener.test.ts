import { OrderCancelledListener } from '../order-cancelled-listener'
import { OrderCancelledEvent } from '@gittix-js/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper' 

describe('test order created listener', () => {
  let data: OrderCancelledEvent['data']
  let msg: Message
  let listener: OrderCancelledListener

  beforeEach(async () => {
    const userId = '123'
    const orderId = '456'

    // Create ticket
    const ticket = Ticket.build({
      userId,
      title: 'A ticket',
      price: 123
    })
    ticket.set({ orderId }) // Ticket is reserved
    await ticket.save()

    // Create data object
    data = {
      id: orderId,
      version: 0,
      ticket: {
        id: ticket.id
      }
    }

    // Create message object
    // @ts-ignore
    msg = {
      ack: jest.fn()
    }

    listener = new OrderCancelledListener(natsWrapper.client)
  })

  it('sets order id of ticket doc as undefined and acks message', async () => {
    const ticket = await Ticket.findById(data.ticket.id)
    expect(ticket.orderId).toEqual(data.id)

    await listener.onMessage(data, msg) // Order is cancelled and event is received

    const updatedTicket = await Ticket.findById(data.ticket.id)
    expect(updatedTicket.orderId).toBeUndefined()
    
    expect(msg.ack).toHaveBeenCalledTimes(1)
  })

  it('throws error if ticket does not exist', async () => {
    data.id = 'random id'

    expect(async() => {
      await listener.onMessage(data, msg)
    }).rejects.toThrow()

    expect(msg.ack).toHaveBeenCalledTimes(0)
  })

  it('publishes a ticket updated event', async () => {
    await listener.onMessage(data, msg)

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1)
    expect(ticketUpdatedData.orderId).toBeUndefined()
  })

})