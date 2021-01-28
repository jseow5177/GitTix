import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { ObjectId } from 'mongodb'
import { Order } from '../models/order'
import { Ticket } from '../models/ticket'
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  BadRequestError,
  OrderStatus
} from '@gittix-js/common'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 60 // Order will expire in 60 seconds

router.post('/api/orders', 
  requireAuth,
  [
    body('ticketId')
    .trim()
    .notEmpty().withMessage('TicketId must be provided').bail()
    // Check and see if is valid mongodb id
    .custom((input: string) => ObjectId.isValid(input)).withMessage('TicketId is not valid')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // 1. Find the ticket the user is trying to order in database.
    const { ticketId } = req.body
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    // 2. Make sure that this ticket is not reserved.
    const isReserved = await ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    // 3. Calculate an expiration date for this order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // 4. Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    })
    await order.save()

    // 5. Publish an event that an order was created

    return res.status(201).send(order)
})

export { router as createOrderRouter }