import mongoose from 'mongoose'

// An interface that describes the properties
// that are required to create a new User.
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties
// that a User Document (a single user) has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
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
    userId: {
      type: String,
      required: true
    }
  },
  {
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
  }
)

// static property to build ticket
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
