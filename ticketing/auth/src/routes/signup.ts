import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

import { Password } from '../utils/password'
import { RequestValidationError } from '../errors/request-validation-error'
import { BadRequestError } from '../errors/bad-request-error'
import { UserSaveError } from '../errors/user-save-error'
import { User } from '../models/user'

const router = express.Router()

router.post('/api/users/signup', 
  [
    body('email')
      .isEmail()
      .withMessage('Email is not valid.'),
    body('password')
      .trim()
      .isLength({ min: 4})
      .withMessage('Password must have at least 4 characters.')
  ],
  async (req: Request, res: Response) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }

    const { email, password } = req.body

    // Check with a user with the sign up email already exist
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadRequestError('Email already in use')
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
      throw new UserSaveError('Sign up failed')
    }
})

export { router as signupRouter }