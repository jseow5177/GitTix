import mongoose from 'mongoose'
import { OrderStatus } from '@gittix-js/common'
import { TicketDoc } from './ticket'

/**
 * An interface that describes the properties
 *  that are required to create a new Order. 
 */
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

/**
 * We need a separate interface for OrderAttrs and OrderDoc because
 *  OrderAttrs are the set of attributes needed to create a User.
 * However, underneath the hood, MongoDB will add some custom properties to the created
 *  Order Document.
 * OrderDoc is for us to expose those properties so that TypeScript will be aware of them.
 */

/**
 * An interface that describes the properties
 *  that a Order Document (a single order) has.
 */
export interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

/**
 * An interface that describes the properties
 *  that an Order Model has.
 */
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId, // Ticket id
    ref: 'Ticket' // Points to the Ticket collection
  }
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
  },
  versionKey: false // Remove version key (__v)
})

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

/**
 * mongoose.model<U, T>
 * T is the generic type of the returned value. In this case, mongoose.model returns data of type OrderModel.
 * U is the generic type of the document. In this case, it is OrderDoc.
 */
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }