import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

/**
 * scrypt is the hashing algorithm that we'll use.
 *
 * promisify is a util function that takes a function following the common error-first callback style,
 * and returns a verion that returns promises.
 */

const scryptAsync = promisify(scrypt)

export class Password {
  static async toHash(password: string) {
    // Generate a random salt of 16 bytes to hash password
    const salt = randomBytes(16).toString('hex')

    try {
      // Hash the password with salt. The hash is returned as a Buffer with 64 bytes.
      // Need to tell TypeScript that buffer is of type Buffer.
      const buffer = (await scryptAsync(password, salt, 64)) as Buffer

      // Convert buffer to string and concatenate it with the salt
      return `${buffer.toString('hex')}.${salt}`
    } catch (error) {
      throw error
    }
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.')

    try {
      const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer

      // Compare hashes
      return buffer.toString('hex') === hashedPassword
    } catch (error) {
      throw error
    }
  }
}