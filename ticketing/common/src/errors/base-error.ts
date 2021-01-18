export abstract class BaseError extends Error {
  abstract statusCode: number;

  constructor(public message: string) {
    super(message)
  }

  abstract serializeErrors(): {
    message: string; // Error message
    field?: string; // Optional field related to error message
  }[]
}