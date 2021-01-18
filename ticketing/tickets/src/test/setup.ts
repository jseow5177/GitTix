import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../app'

/**
 * This setup file is executed after the testing framework is installed into the test environment.
 */

let mongo: any

// Tell TypeScript that there will be a global function called signup
declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string[]>;
    }
  }
}

/**
 * 1. Start an instance of MongoMemoryServer
 * 2. Get the Uri of the Mongo database
 * 3. Connect mongoose to it
 */
beforeAll(async () => {
  // Set environment variables
  process.env.JWT_KEY = 'qwertyui'

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

/**
 * Clear all data in between tests
 */
beforeEach(async () => {
  // Get all collections of the connected db
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    // Pass in an empty filter to remove al documents from a collection
    await collection.deleteMany({})
  }
})

/**
 * 1. Stop mongo instance
 * 2. Close mongoose connection
 */
afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

/**
 * Helper sign in function so that we can easily test private routes
 */
global.signup = async () => {
  const email = 'test@test.com'
  const password = 'qwertyui'

  const res = await request(app).post('/api/users/signup').send({
    email, password
  })

  const cookie = res.get('Set-Cookie')

  return cookie
}