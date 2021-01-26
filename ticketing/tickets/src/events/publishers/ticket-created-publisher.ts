import { Publisher, Subjects, TicketCreatedEvent } from '@gittix-js/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}