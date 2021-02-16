import { Publisher, Subjects, PaymentCreatedEvent } from '@gittix-js/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}