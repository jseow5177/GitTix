import { Subjects } from '../base/subjects'

export interface OrderCancelledEvenet {
  subjects: Subjects.OrderCancelled;
  data: {
    id: string; // Order id
    ticket: {
      id: string;
    }
  }
}