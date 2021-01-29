/**
 * Enum is a TypeScript feature that allows developers to define a set of named constants.
 * 
 * Docs: https://www.typescriptlang.org/docs/handbook/enums.html
 * 
 * The following enum defines the different channels that NATS has.
 */

export enum Subjects {
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',
  OrderCreated = 'order:created',
  OrderCancelled = 'order:cancelled'
}