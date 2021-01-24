import { Subjects } from '../subjects'

/**
 * Creates a tight coupling between channel and event payload
 */
export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  }
}


