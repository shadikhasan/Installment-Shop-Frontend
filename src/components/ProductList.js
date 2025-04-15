import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AppHeader from './AppHeader'

const baseURL = 'http://127.0.0.1:8000' // Replace if different

const ProductList = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    axios
      .get(`${baseURL}/products/`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
  }, [])

  const handlePurchase = (productId) => {
    axios
      .post(`${baseURL}/purchases/create/`, {
        product: productId,
        quantity: 1,
      })
      .then(() => alert('Purchase successful!'))
      .catch((err) => {
        console.error(err)
        alert('Purchase failed.')
      })
  }

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">
                    <strong>Price:</strong> ৳{product.price}
                  </p>
                  <button className="btn btn-primary" onClick={() => handlePurchase(product.id)}>
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ProductList
