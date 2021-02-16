import { useState } from 'react'

function NewTicket() {

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')

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

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form className="card p-4 w-18">
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
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default NewTicket