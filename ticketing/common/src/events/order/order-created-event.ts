import { Subjects } from '../base/subjects'
import { OrderStatus } from '../types/order-status'

export interface OrderCreatedEvent {
  subjects: Subjects.OrderCreated;
  data: {
    id: string; // Order id
    status: OrderStatus;
    userId: string;
    expiresAt: string; // Date object will be converted to string
    ticket: {
      id: string;
      price: number;
    }
  }
}