import express from 'express'

import { Ticket } from '../models/ticket'
import { NotFoundError } from '@gittix-js/common'

const router = express.Router()

router.get('/api/tickets/:id', async (req, res) => {
  const ticketId = req.params.id

  const ticket = await Ticket.findById(ticketId)

  if (!ticket) {
    throw new NotFoundError()
  }

  return res.status(200).send(ticket)
})

export { router as retrieveTicketRouter }