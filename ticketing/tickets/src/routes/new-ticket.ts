import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@gittix-js/common'

import { Ticket } from '../models/ticket'

const router = express.Router()

router.post('/api/tickets',
  requireAuth,
  [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required').bail(),
    body('price')
      .trim()
      .notEmpty().withMessage('Price is required').bail()
      .isFloat({ gt: 0 }).withMessage('Price must be larger than zero')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body
    const userId = req.currentUser!.id // If the request reaches here, currentUser must be defined

    const ticket = Ticket.build({ title, price, userId })

    await ticket.save()

    return res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }