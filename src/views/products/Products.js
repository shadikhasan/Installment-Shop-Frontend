import React, { useEffect, useState } from 'react'
import { publicAxios, authAxios } from '../../axiosConfig'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CFormInput,
  CForm,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react'

const Products = () => {
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', price: '' })

  // Get user roles from localStorage
  const isAdmin = localStorage.getItem('is_superuser') === 'true'
  const isLoggedIn = !!localStorage.getItem('access_token')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = () => {
    publicAxios
      .get('/products/')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
  }

  const handlePurchase = (productId) => {
    if (!isLoggedIn) return alert('Please log in to purchase.')
    authAxios
      .post('/purchases/', { product: productId, quantity: 1 })
      .then(() => alert('Purchase successful!'))
      .catch((err) => {
        console.error(err)
        alert('Purchase failed.')
      })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      authAxios
        .delete(`/products/${id}/`)
        .then(() => {
          alert('Product deleted!')
          fetchProducts()
        })
        .catch((err) => {
          console.error(err)
          alert('Deletion failed.')
        })
    }
  }

  const handleEdit = (product) => {
    setEditProduct(product)
    setFormData({ name: product.name, description: product.description, price: product.price })
    setShowModal(true)
  }

  const handleAdd = () => {
    setEditProduct(null)
    setFormData({ name: '', description: '', price: '' })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const method = editProduct ? 'put' : 'post'
    const url = editProduct ? `/products/${editProduct.id}/` : '/products/'

    authAxios[method](url, formData)
      .then(() => {
        setShowModal(false)
        fetchProducts()
        alert(editProduct ? 'Product updated!' : 'Product added!')
      })
      .catch((err) => {
        console.error(err)
        alert('Error saving product.')
      })
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Product List</h4>
            <div className="small text-body-secondary">Available Products</div>
          </div>
          {isAdmin && (
            <CButton color="success" onClick={handleAdd}>
              + Add Product
            </CButton>
          )}
        </CCardHeader>
        <CCardBody>
          <CRow>
            {products.map((product) => (
              <CCol key={product.id} md={4} className="mb-4">
                <CCard className="h-100 shadow-sm">
                  <CCardBody>
                    <h5>{product.name}</h5>
                    <p>{product.description}</p>
                    <p><strong>Price:</strong> ৳{product.price}</p>
                    {isLoggedIn && (
                      <CButton color="primary" onClick={() => handlePurchase(product.id)}>
                        Purchase
                      </CButton>
                    )}
                    {isAdmin && (
                      <div className="mt-2 d-flex gap-2">
                        <CButton color="info" size="sm" onClick={() => handleEdit(product)}>
                          Edit
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDelete(product.id)}>
                          Delete
                        </CButton>
                      </div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        </CCardBody>
      </CCard>

      {/* Modal for Add/Edit */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader closeButton>
          <strong>{editProduct ? 'Edit Product' : 'Add New Product'}</strong>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormInput
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mb-3"
            />
            <CFormInput
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="mb-3"
            />
            <CFormInput
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="mb-3"
            />
            <CModalFooter>
              <CButton color="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </CButton>
              <CButton type="submit" color="primary">
                {editProduct ? 'Update' : 'Add'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default Products
