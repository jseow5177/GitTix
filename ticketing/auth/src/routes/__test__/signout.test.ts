import request from 'supertest'
import { app } from '../../app'

describe('test signout post route', () => {

  it('clears the cookie after signingout', async () => {
    // Sign up user first
    await request(app).post('/api/users/signup').send({
      email: 'test@test.com',
      password: 'qwertyui'
    })

    const res = await request(app).post('/api/users/signout').send({})

    expect(res.status).toEqual(200)
    expect(res.get('Set-Cookie'))
      .toEqual(["express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"])
  })
})