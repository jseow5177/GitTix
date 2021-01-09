import { CustomError } from './custom-error'

export class UserSaveError extends CustomError {
  statusCode = 500

  constructor(public message: string) {
    super(message)
  }

  serializeErrors() {
    return [{ message: this.message }]
  }
}