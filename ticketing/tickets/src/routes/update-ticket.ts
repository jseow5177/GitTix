import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError
} from '@gittix-js/common'
import { Ticket } from '../models/ticket'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-update-publisher'
import { natsWrapper } from '../nats-wrapper'


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

    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket')
    }

    ticket.set({ title, price })

    await ticket.save()

    const publisher = new TicketUpdatedPublisher(natsWrapper.client)
    await publisher.publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    })

    return res.status(200).send(ticket)
  }
)


export { router as updateTicketRouter }