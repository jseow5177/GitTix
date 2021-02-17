import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

import { STRIPE_KEY } from '../../constants'

function Order({ order, currentUser }) {

  const [timeLeft, setTimeLeft] = useState(0)
  const [doRequest, errors] = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    findTimeLeft() // Invoke the first time to display time to expiry
    const timer = setInterval(findTimeLeft, 1000) // Count down the timer

    return () => clearInterval(timer) // Remove interval if component ever dismounts
  }, [])

  const submitToken = async (tokenObj) => {
    const { id: token } = tokenObj
    await doRequest({ token })
  }

  return (
    <div>
      {
        timeLeft < 0
          ? <h1>Order expired</h1>
          :
          <div>
            <h1>Time left to pay: {timeLeft} seconds</h1>
            <StripeCheckout
              name="Enter Card Details"
              token={submitToken}
              stripeKey={STRIPE_KEY}
              amount={order.ticket.price * 100}
              currency="SGD"
              email={currentUser.email}
            />
            {errors}
          </div>
      }
    </div>
  )
}

Order.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default Order