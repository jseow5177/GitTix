import useRequest from '../../hooks/use-request'
import Router from 'next/router'

function Ticket({ ticket }) {

  const [doRequest, errors] = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order) => Router.push(`/orders/${order.id}`)
  })

  const createOrder = async () => {
    await doRequest()
  }

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={createOrder} className="btn btn-primary">Purchase</button>
    </div>
  )
}

Ticket.getInitialProps = async (context, client) => {
  // Extract query param
  const { ticketId } = context.query

  const { data } = await client.get(`/api/tickets/${ticketId}`)

  return { ticket: data }
}

export default Ticket