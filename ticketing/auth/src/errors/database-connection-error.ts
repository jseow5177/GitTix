import { CustomError } from './custom-error'

export class DatabaseConnectionError extends CustomError {
  statusCode = 503
  reason = 'Error connecting to database'

  constructor() {
    super('Failed db connection in auth service')
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}