import { Publisher, Subjects, OrderCancelledEvent } from '@gittix-js/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}