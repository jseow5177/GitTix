import { Ticket } from '../ticket'

describe('test ticket model', () => {

  it('correctly implements optimistic concurrency control', async () => {
    // Create an instance of a ticket
    const ticket = Ticket.build({
      title: 'A title',
      price: 123,
      userId: '123'
    })

    // Save the ticket to the database
    await ticket.save()

    // Fetch two instance of the ticket above from database
    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)

    // Make two separate changes to the tickets we fetched
    firstInstance!.set({ price: 10 })
    secondInstance!.set({ price: 15 })

    // save the first fetched ticket
    await firstInstance!.save()

    expect(async() => await secondInstance!.save()).rejects.toThrow()
  })

  it('increments version number on multiple saves', async () => {
    const ticket = Ticket.build({
      title: 'A title',
      price: 123,
      userId: '123'
    })

    await ticket.save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
  })

})