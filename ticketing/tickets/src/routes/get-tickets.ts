import express from 'express'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get('/api/tickets', async (req, res) => {
  // Get all tickets
  const tickets = await Ticket.find({ orderId: undefined })

  return res.status(200).send(tickets)
})

export { router as getTicketsRouter }