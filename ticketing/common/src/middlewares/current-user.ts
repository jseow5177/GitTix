import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
  id: string;
  email: string
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload // An optional currentUser field for request
    }
  }
}

/**
 * currentUser middleware is placed before the requireAuth middleware
 */
export const currentUser = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // If no cookie or no json web token
  if (!req.session || !req.session.jwt) {
    return next()
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload

    req.currentUser = payload
    
    return next()
  } catch {
    // If token validation fails
    return next()
  }
}