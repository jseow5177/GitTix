import { Request, Response, NextFunction } from 'express'
import { AuthServiceError } from '../errors/auth-service-error'

/**
 * requireAuth middleware is placed after the currentUser middleware
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new AuthServiceError(401, 'You are not authorized')
  }

  next()
}