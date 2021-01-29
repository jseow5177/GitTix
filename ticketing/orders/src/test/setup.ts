import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

/**
 * This setup file is executed after the testing framework is installed into the test environment.
 */

let mongo: any

// Tell TypeScript that there will be a global function called signup
declare global {
  namespace NodeJS {
    interface Global {
      signup(): string[];
    }
  }
}

// Mock nats-wrapper
jest.mock('../nats-wrapper')

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
 * Creates a mock cookie and returns it
 */
global.signup = () => {
  // Build a JWT paylod: {id, email}
  const payload = {
    id: new ObjectId(),
    email: 'test@test.com'
  }

  // Create a JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build session Object: { jwt: JWT }
  const session = { jwt: token }

  // Stringify the Object as JSON
  const sessionJSON = JSON.stringify(session)

  // Take JSON and encode as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  //Return the base64 string in array form (required by supertest)
  return [`express:sess=${base64}`]
}