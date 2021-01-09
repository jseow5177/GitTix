import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { User } from '../models/user'
import { Password } from '../utils/password'
import { validateRequest } from '../middlewares/validate-request'
import { AuthServiceError } from '../errors/auth-service-error'

const router = express.Router()

router.post('/api/users/signin',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required').bail()
      .isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      throw new AuthServiceError(400, 'Invalid credentials')
    }

    try {
      const passwordsMatch = await Password.compare(existingUser.password, password)

      if (!passwordsMatch) {
        throw new AuthServiceError(400, 'Invalid credentials')
      }

      // Generate JWT (Synchronous)
      const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
      },
        process.env.JWT_KEY!
      )

      // Store in session object
      req.session = {
        jwt: userJwt
      }

      return res.status(201).send(existingUser)
    } catch (error) {
      if (error) {
        throw error
      }
      throw new AuthServiceError(500, 'Sign in failed')
    } 

  }
)

export { router as signinRouter }