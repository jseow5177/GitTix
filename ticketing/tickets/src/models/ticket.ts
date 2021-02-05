import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

/**
 * An interface that describes the properties
 *  that are required to create a new Ticket. 
 */
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

/**
 * We need a separate interface for TicketAttrs and TicketDoc because
 *  TicketAttrs are the set of attributes needed to create a User.
 * However, underneath the hood, MongoDB will add some custom properties to the created
 *  Ticket Document.
 * TicketDoc is for us to expose those properties so that TypeScript will be aware of them.
 */

/**
 * An interface that describes the properties
 *  that a Ticket Document (a single ticket) has.
 */
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string; // Optional property
}

/**
 * An interface that describes the properties
 *  that a Ticket Model has. 
 */
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
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
  userId: {
    type: String,
    required: true
  },
  orderId: {
    type: String
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
  }
})

ticketSchema.set('versionKey', 'version') // Rename version key from __v to version
ticketSchema.plugin(updateIfCurrentPlugin)

// static property to build ticket
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

/**
 * mongoose.model<U, T>
 * T is the generic type of the returned value. In this case, mongoose.model returns data of type TicketModel.
 * U is the generic type of the document. In this case, it is TicketDoc.
 */
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
