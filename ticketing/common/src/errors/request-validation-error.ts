import { ValidationError } from 'express-validator'
import { BaseError } from './base-error'

/**
 * Handle validation in signup and signin requests.
 * 
 * Extends the AuthServiceError and override the serializeErrors method.
 */

export class RequestValidationError extends BaseError {
  statusCode = 400

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters')
  }

  serializeErrors() {
    return this.errors.map(err => ({
      message: err.msg,
      field: err.param
    }))
  }
}