/**
 * The different status that an order can have.
 * 
 * The definition of status need to be consistent across the Orders, Expiration and Tickets services.
 */

export enum OrderStatus {
  /**
   * When the order has been created,
   *  but the ticket it is trying to order has not been reserved.
   */
  Created = 'created',

  /**
   * Happens when:
   * 1. The ticket that the order is trying to reserve has already been reserved
   * 2. The user cancels the order
   * 3. The order expires before payment
   */
  Cancelled = 'cancelled',

  /**
   * When the order has successfully reserves the ticket
   *  and waiting for user payment
   */
  AwaitingPayment = 'awaiting:payment',

  /**
   * When the ticket has been reserved and payment is successfully provided
   */
  Complete = 'complete'
}