import request from 'supertest'
import mongoose from 'mongoose'
import { OrderStatus } from '@gittix-js/common'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Payment } from '../../models/payment'
import { stripe } from '../../stripe'

describe('test create new payment route', () => {

  const orderId = mongoose.Types.ObjectId().toHexString()
  const userId = mongoose.Types.ObjectId().toHexString()

  beforeEach(async () => {
    const order = Order.build({
      id: orderId,
      userId,
      price: 20,
      version: 0,
      status: OrderStatus.Created
    })
    await order.save()
  })

  test('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signup())
      .send({
        token: '123',
        orderId: mongoose.Types.ObjectId().toHexString() // Non-existent ticket
      })
      .expect(404)
  })

  test('returns a 401 when purchasing an order that does not belong to the user', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signup()) // Other user
      .send({
        token: '123',
        orderId: orderId
      })
      .expect(401)
  })

  test('returns a 400 when purchasing a cancelled order', async () => {
    const order = await Order.findById(orderId)
    order!.set('status', OrderStatus.Cancelled) // Order is cancelled
    await order!.save()

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signup(userId)) // Try to update with user who created the ticket
      .send({
        token: '123',
        orderId: orderId
      })
      .expect(400)
  })

  test('returns a 201 when all inputs are valid', async () => {
    const order = await Order.findById(orderId)

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signup(userId))
      .send({
        token: 'tok_visa', // Doesn't matter as stripe client is mocked
        orderId: orderId
      })
      .expect(201)

      expect(stripe.charges.create).toHaveBeenCalledTimes(1)
      expect(stripe.charges.create).toHaveBeenCalledWith({
        currency: 'sgd',
        source: 'tok_visa',
        amount: order!.price * 100,
        description: `Payment for order ${orderId}`
      })

      const payment = await Payment.findOne({ orderId: order!.id })
      // Cannot use toBeDefined check! If payment does not exist, will return null
      expect(payment).not.toBeNull()
  })
})