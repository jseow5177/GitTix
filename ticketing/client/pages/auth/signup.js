import { useState } from 'react'
import Router from 'next/router'

import AuthForm from '../../components/auth-form'
import useRequest from '../../hooks/use-request'

function Signup() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Create request
  const [doRequest, errors] = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/') // Success callback
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    await doRequest()
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  return (
    <AuthForm
      title="Sign Up"
      buttonText="Sign Up"
      email={email}
      password={password}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      submit={handleSubmit}
      errors={errors}
    />
  )
}

export default Signup