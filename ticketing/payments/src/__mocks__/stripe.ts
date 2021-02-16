/**
 * A mock of Stripe client.
 * 
 * Only for reference. No longer used in test environment. 
 */

export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: 'payment_id' }) // A mock function that resolves to an empty object
  }
}

export default class Hello {}