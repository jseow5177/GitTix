import request from 'supertest'
import { app } from '../../app'

describe('test signup post route', () => {
  
  it('returns a 201 on successful signup', async () => {
    const res = await request(app).post('/api/users/signup').send({
      email: 'test@test.com',
      password: 'qwertyui'
    })

    expect(res.status).toEqual(201)
  })

   it('sets a cookie on successful signup', async () => {
    const res = await request(app).post('/api/users/signup').send({
      email: 'test@test.com',
      password: 'qwertyui'
    })

    expect(res.get('Set-Cookie')).toBeDefined()
  })

  it('returns a 400 with an empty email', async () => {
    const res = await request(app).post('/api/users/signup').send({
      email: '',
      password: 'qwertyui'
    })

    const expectedResponseBody = {
      errors: [{ field: 'email', message: 'Email is required' }]
    }

    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expectedResponseBody)
  })

  it('returns a 400 with an invalid email', async () => {
    const res = await request(app).post('/api/users/signup').send({
      email: 'invalid_email',
      password: 'qwertyui'
    })

    const expectedResponseBody = {
      errors: [{ field: 'email', message: 'Email is not valid' }]
    }
    
    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expectedResponseBody)
  })

  it('returns a 400 with an empty password', async () => {
    const res = await request(app).post('/api/users/signup').send({
      email: 'test@test.com',
      password: ''
    })

    const expectedResponseBody = {
      errors: [{ field: 'password', message: 'Password is required' }]
    }
    
    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expectedResponseBody)
  })

  it('returns a 400 with an invalid password', async () => {
    const res = await request(app).post('/api/users/signup').send({
      email: 'test@test.com',
      password: 'qwe'
    })

    const expectedResponseBody = {
      errors: [{ field: 'password', message: 'Password must have at least 4 characters' }]
    }
    
    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expectedResponseBody)
  })

  it('returns a 400 with a missing password field', async () => {
    const res = await request(app).post('/api/users/signup').send({
      email: 'test@test.com',
    })

    const expectedResponseBody = {
      errors: [{ field: 'password', message: 'Password is required' }]
    }
    
    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expectedResponseBody)
  })

  it('returns a 400 with a missing email field', async () => {
    const res = await request(app).post('/api/users/signup').send({
      password: 'qwertyui'
    })

    const expectedResponseBody = {
      errors: [{ field: 'email', message: 'Email is required' }]
    }
    
    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expectedResponseBody)
  })

  it('disallows duplicate email', async () => {
    // Successfully signs up a user first
    await request(app).post('/api/users/signup').send({
      email: 'test@test.com',
      password: 'qwertyui'
    })

    // Attempt to sign up with same email again
    const res = await request(app).post('/api/users/signup').send({
      email: 'test@test.com',
      password: 'qwertyui'
    })

    const expectedResponseBody = {
      errors: [{ message: 'Email already in use' }]
    }
    
    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expectedResponseBody)
  })

})