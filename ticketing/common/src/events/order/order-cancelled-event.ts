import { Subjects } from '../base/subjects'

export interface OrderCancelledEvenet {
  subject: Subjects.OrderCancelled;
  data: {
    id: string; // Order id
    ticket: {
      id: string;
    }
  }
}