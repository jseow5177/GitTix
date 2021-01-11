import request from 'supertest'
import { app } from '../../app'

describe('test signin post route', () => {

  it('fails with email that does not exist', async () => {
    const res = await request(app).post('/api/users/signin').send({
      email: 'test@test.com',
      password: 'qwertyui'
    })

    const expectedResponseBody = {
      errors: [{ message: 'Invalid credentials' }]
    }

    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expectedResponseBody)
  })

  it('fails when an incorrect password is supplied', async () => {
    // Signs up user first
    await request(app).post('/api/users/signup').send({
      email: 'test@test.com',
      password: 'qwertyui'
    })

    // Signs in user with wrong password
    const res = await request(app).post('/api/users/signin').send({
      email: 'test@test.com',
      password: 'wrong_password'
    })

    const expectedResponseBody = {
      errors: [{ message: 'Invalid credentials' }]
    }

    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expectedResponseBody)
  })

  it('response with a cookie when given correct credentials', async () => {
    // Signs up user first
    await request(app).post('/api/users/signup').send({
      email: 'test@test.com',
      password: 'qwertyui'
    })

    // Signs in user with right password
    const res = await request(app).post('/api/users/signin').send({
      email: 'test@test.com',
      password: 'qwertyui'
    })
    expect(res.status).toEqual(201)
    expect(res.get('Set-Cookie')).toBeDefined()
  })

})