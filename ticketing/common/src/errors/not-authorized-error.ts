import { BaseError } from './base-error'

export class NotAuthorizedError extends BaseError {
  statusCode = 401
  message = 'Not authorized'

  constructor() {
    super('Not authorized')
  }

  serializeErrors() {
    return [{ message: this.message }]
  }
}