function Orders({ orders }) {

  return (
    <ul>
      {
        orders.map(order => <li key={order.li}>{order.ticket.title}: {order.status}</li>)
      }
    </ul>
  )
}

Orders.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders')

  return { orders: data }
}

export default Orders