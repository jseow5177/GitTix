import { BaseError } from './base-error'

export class NotFoundError extends BaseError {
  statusCode = 404
  message = 'Not found'

  constructor() {
    super('Not found')
  }

  serializeErrors() {
    return [{ message: this.message }]
  }
}