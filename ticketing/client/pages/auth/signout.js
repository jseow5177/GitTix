import { useEffect } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

function Signout() {

  const [doRequest] = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  })

  useEffect(async () => {
    await doRequest()
  }, [])

  return <div>Signing out...</div>
}

export default Signout