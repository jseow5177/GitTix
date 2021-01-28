import mongoose from 'mongoose';

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
}

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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }