import mongoose from 'mongoose'
import { Password } from '../utils/password'

// An interface that describes the properties
// that are required to create a new User.
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document (a single user) has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
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
})

// pre-save hook
userSchema.pre('save', async function (done) {
  // Check if the password field is modified
  // When a user is first created, the password field is considered as being modified as well
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }
  done() // Indicates that the async work is done
})

// static property to build user
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

// mongoose.model<U, T>
// T is the generic type of the returned value. In this case, mongoose.model returns data of type UserModel.
// U is the generic type of the document. In this case, it is UserDoc.
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }



