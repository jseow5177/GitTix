/**
 * Abstract base error class for auth service.
 * 
 * Serves as the template for more specific errors.
 */

export abstract class BaseError extends Error {

  constructor(public statusCode: number, public message: string) {
    super(message)
  }

  abstract serializeErrors(): {
    message: string;
    field?: string
  }[]
}