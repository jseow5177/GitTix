import { Subjects } from '../base/subjects'
import { OrderStatus } from './types/order-status'

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string; // Order id
    version: number;
    status: OrderStatus;
    userId: string;
    expiresAt: string; // Date object will be converted to string
    ticket: {
      id: string;
      price: number;
    }
  }
}