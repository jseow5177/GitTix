import axios from 'axios'
import { useState } from 'react'

/**
 * Closures in action!
 */
const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async () => {
    setErrors(null)
    try {
      const response = await axios[method](url, body)

      if (onSuccess) {
        // Run success callback
        onSuccess(response.data)
      }

      return response.data
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {
              err.response.data.errors.map((err, index) => (
                <li key={index}>{err.message}</li>
              ))
            }
          </ul>
        </div>
      )
    }
  }

  return [doRequest, errors]
}

export default useRequest

