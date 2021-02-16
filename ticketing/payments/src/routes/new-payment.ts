import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus
} from '@gittix-js/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { natsWrapper } from '../nats-wrapper'
import { stripe } from '../stripe'
import { Order } from '../models/order'
import { Payment } from '../models/payment'

const router = express.Router()

router.post('/api/payments',
  requireAuth,
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('orderId').notEmpty().withMessage('Order Id is required')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order has expired')
    }

    const charge = await stripe.charges.create({
      currency: 'sgd',
      amount: order.price * 100, // Convert to smallest currency unit,
      source: token,
      description: `Payment for order ${orderId}`
    })

    const payment = Payment.build({
      orderId,
      stripeId: charge.id
    })
    await payment.save()

    const publisher = new PaymentCreatedPublisher(natsWrapper.client)
    publisher.publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    })
    
    return res.status(201).send({ id: payment.id })
})

export { router as createPaymentRouter }
