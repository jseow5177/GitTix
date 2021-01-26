import { Publisher, Subjects, TicketUpdatedEvent } from '@gittix-js/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}