import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError
} from '@gittix-js/common'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.put('/api/tickets/:id',
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
    const ticket = await Ticket.findById(req.params.id)
    const { title, price } = req.body

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    ticket.set({ title, price })

    await ticket.save()

    return res.status(200).send(ticket)
  }
)


export { router as updateTicketRouter }