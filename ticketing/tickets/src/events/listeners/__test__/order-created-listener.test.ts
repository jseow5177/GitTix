import { OrderCreatedListener } from '../order-created-listener'
import { OrderCreatedEvent, OrderStatus } from '@gittix-js/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper' 

describe('test order created listener', () => {
  let data: OrderCreatedEvent['data']
  let msg: Message
  let listener: OrderCreatedListener

  beforeEach(async () => {
    const userId = '123'
    const orderId = '456'

    // Create ticket
    const ticket = Ticket.build({
      userId,
      title: 'A ticket',
      price: 123
    })
    await ticket.save()

    // Create data object
    data = {
      id: orderId,
      version: 0,
      status: OrderStatus.Created,
      userId,
      expiresAt: new Date().toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    }

    // Create message object
    // @ts-ignore
    msg = {
      ack: jest.fn()
    }

    listener = new OrderCreatedListener(natsWrapper.client)
  })

  it('saves order id into ticket doc and acks message', async () => {
    const ticket = await Ticket.findById(data.ticket.id)
    expect(ticket.orderId).toBeUndefined() // No orderId on ticket creation

    await listener.onMessage(data, msg) // Order is created and event is received

    const updatedTicket = await Ticket.findById(data.ticket.id)
    expect(updatedTicket.orderId).toBe(data.id)
    
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

    // Get the first argument of the first call to natsWrapper.client.publish
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1)
    expect(ticketUpdatedData.orderId).toEqual(data.id)
  })

})