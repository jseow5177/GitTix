import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../errors/custom-error'
import { RequestValidationError } from '../errors/request-validation-error'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  }

  return res.status(500).send({
    errors: [
      { message: 'Something went horribly wrong!' }
    ]
  })
}