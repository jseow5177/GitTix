export abstract class CustomError extends Error {
  abstract statusCode: number

  constructor(message: string) {
    // Pass message for logging purposes
    super(message)
  }

  abstract serializeErrors(): {
    message: string;
    field?: string
  }[]
}