import { Subjects } from '../base/subjects'

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    id: string; // Order id
    version: number;
    ticket: {
      id: string;
    }
  }
}