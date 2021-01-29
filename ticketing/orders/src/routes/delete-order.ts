import express, { Request, Response } from 'express'
import { Order } from '../models/order'
import { requireAuth, OrderStatus, NotFoundError, NotAuthorizedError } from '@gittix-js/common'

const router = express.Router()

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId)

  if (!order) {
    throw new NotFoundError()
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  /**
   * The order is not exactly deleted.
   * It's status is changed to Cancelled.
   */
  order.status = OrderStatus.Cancelled
  await order.save()

  // TODO: Publish an event Expiration and Payment services that an order is cancelled

  return res.status(204).send({}) // A 204 response does not include message body
})

export { router as deleteOrderRouter }