import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { User } from '../models/user'
import { Password } from '../utils/password'
import { validateRequest, BadRequestError } from '@gittix-js/common'

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
      throw new BadRequestError('Invalid credentials')
    }

    const passwordsMatch = await Password.compare(existingUser.password, password)
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials')
    }

    // Generate JWT (Synchronous)
    const userJwt = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY!)

    // Store in session object
    req.session = {
      jwt: userJwt
    }

    return res.status(201).send(existingUser)

  }
)

export { router as signinRouter }