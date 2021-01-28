import express, { Request, Response } from 'express'

const router = express.Router()

router.get('/api/orders/:id', async (req: Request, res: Response) => {
  return res.send({})
})

export { router as retrieveOrderRouter }