import express from 'express'
import { json, urlencoded } from 'body-parser'

const PORT = 3000
const app = express()

app.use(json())
app.use(urlencoded({ extended: true }))

app.get('/api/users/currentuser', (req, res) => {
  return res.status(200).send('It is done!!!')
})

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`)
})