import express from 'express'

import { currentUser } from '@gittix-js/common'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, (req, res) => {
  return res.status(200).send({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter }