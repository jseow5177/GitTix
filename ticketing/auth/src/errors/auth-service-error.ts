import { BaseError } from './base-error'

/**
 * Error class for auth service
 */

export class AuthServiceError extends BaseError {
  
  constructor(statusCode: number, message: string) {
    super(statusCode, message)
  }

  serializeErrors() {
    return [{ message: this.message }]
  }
}