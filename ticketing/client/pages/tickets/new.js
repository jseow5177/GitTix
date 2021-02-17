import { useState } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

function NewTicket() {

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')

  const [doRequest, errors] = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: () => Router.push('/')
  })

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }

  const handlePriceChange = (e) => {
    setPrice(e.target.value)
  }

  const sanitizePrice = () => {
    const value = parseFloat(price)

    if (isNaN(value)) {
      return // Invalid input will be handled by server
    }

    // Convert number to a string, rounding the number to keep only two decimals
    setPrice(value.toFixed(2))
  }

  const createTicket = async (e) => {
    e.preventDefault()
    await doRequest()
  }

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={createTicket} className="card p-4">
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            value={price}
            onChange={handlePriceChange}
            onBlur={sanitizePrice}
          />
        </div>
        {errors}
        <button
          className="btn btn-primary"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default NewTicket