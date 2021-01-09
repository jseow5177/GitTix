import mongoose from 'mongoose'

// An interface that describes the properties
// that are required to create a new User.
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Document (a single user) has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    /**
     * Called when document object is converted to JSON.
     * This is to standardize the JSON properties of returned user.
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
        delete ret.password // Remove password field
      }
    },
    versionKey: false // Remove version key (__v)
  }
)

// static property to build user
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

// mongoose.model<U, T>
// T is the generic type of the returned value. In this case, mongoose.model returns data of type UserModel.
// U is the generic type of the document. In this case, it is UserDoc.
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }



