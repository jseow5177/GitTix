import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { User } from '../models/user'
import { Password } from '../utils/password'
import { validateRequest } from '../middlewares/validate-request'
import { AuthServiceError } from '../errors/auth-service-error'

const router = express.Router()

router.post('/api/users/signup', 
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required').bail()
      .isEmail().withMessage('Email is not valid'),
    body('password')
      .trim()
      .notEmpty().withMessage('Password is required').bail()
      .isLength({ min: 4 }).withMessage('Password must have at least 4 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { email, password } = req.body

    // Check with a user with the sign up email already exist
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new AuthServiceError(400, 'Email already in use')
    }

    try {
      // Hash password with scrypt
      const hashedPassword = await Password.toHash(password)

      const user = User.build({ email, password: hashedPassword })
      
      // Save user into DB
      await user.save()

      // Generate JWT (Synchronous)
      const userJwt = jwt.sign({
        id: user.id,
        email: user.email
      },
        // Append a non-null assertion operator (!)
        // Tells the TypeScript compiler that this expression can never be null or undefined
        // as a check is already made at app startup
        process.env.JWT_KEY!
      )

      // Store in session object
      req.session = {
        jwt: userJwt
      }

      // user document will be converted to JSON (through the toJSON method) and returned
      return res.status(201).send(user)
    } catch {
      throw new AuthServiceError(500, 'Sign up failed')
    }
})

export { router as signupRouter }