import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { Order } from '../models/order'
import { OrderStatus } from '@gittix-js/common'

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

interface EventAttrs {
  id: string;
  version: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: EventAttrs): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
}, {
  /**
   * Called when document object is converted to JSON.
   * This is to standardize the JSON properties of returned ticket.
   * 
   * It is not common to place such logic on the model level.
   */
  toJSON: {
    transform(doc, ret) {
      /**
       * @param doc The mongoose document which is being converted
       * @param ret The plain object representation which has been converted
       * 
       * We will directly modify the object being returned
       */
      ret.id = ret._id // Remap _id field to id
      delete ret._id // Remove _id field
    }
  }
})

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    // ID adjustment
    // Ensures that the ticket id in orders service is the same as ticket id in tickets service
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price
  })
}

ticketSchema.statics.findByEvent = (event: EventAttrs) => {
  return Ticket.findOne({ _id: event.id, version: event.version - 1 })
}

ticketSchema.methods.isReserved = async function() {
  /**
   * A ticket is reserved if
   * 1. An order with the ticket exists and
   * 2. The order status is not cancelled.
   */
  const existingOrder = await Order.findOne({
    ticket: this.id,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  })
  return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }