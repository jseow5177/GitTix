import { ValidationError } from 'express-validator'
import { AuthServiceError } from './auth-service-error'

/**
 * Handle validation in signup and signin requests.
 * 
 * Extends the AuthServiceError and override the serializeErrors method.
 */

export class RequestValidationError extends AuthServiceError{

  constructor(
    public statusCode: number, 
    public message: string, 
    public errors: ValidationError[]
  ) {
    super(statusCode, message)
  }

  // Override serializeErrors of the generic auth service class
  serializeErrors() {
    return this.errors.map(err => ({
      message: err.msg,
      field: err.param
    }))
  }
}