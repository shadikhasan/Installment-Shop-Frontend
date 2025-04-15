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
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', price: '' })

  const [purchaseModal, setPurchaseModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [purchaseForm, setPurchaseForm] = useState({
    quantity: 1,
    first_installment_amount: 0,
    installment_count: 1,
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)

  const isAdmin = localStorage.getItem('is_superuser') === 'true'
  const isLoggedIn = !!localStorage.getItem('access_token')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [searchQuery, products])

  useEffect(() => {
    if (selectedProduct) {
      const pricePerUnit = parseFloat(selectedProduct.price) || 0
      const total = pricePerUnit * purchaseForm.quantity
      setTotalPrice(total)
    }
  }, [purchaseForm.quantity, selectedProduct])

  const fetchProducts = () => {
    publicAxios
      .get('/products/')
      .then((res) => {
        setProducts(res.data)
        setFilteredProducts(res.data)
      })
      .catch((err) => {
        console.error(err)
        toast.error('Failed to load products. Please try again later.')
      })
  }

  const filterProducts = () => {
    const query = searchQuery.toLowerCase()
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    )
    setFilteredProducts(filtered)
  }

  const handlePurchase = (product) => {
    if (!isLoggedIn) return toast.info('Please log in to purchase.')
    setSelectedProduct(product)
    setPurchaseForm({
      quantity: 1,
      first_installment_amount: 0,
      installment_count: 1,
    })
    setErrorMessage('')
    setPurchaseModal(true)
  }

  const submitPurchase = () => {
    if (!selectedProduct) return

    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = now.toTimeString().split(' ')[0]

    const payload = {
      product: selectedProduct.id,
      quantity: purchaseForm.quantity,
      purchase_date: date,
      purchase_time: time,
      first_installment_amount: purchaseForm.first_installment_amount,
      installment_count: purchaseForm.installment_count,
    }

    authAxios
      .post('/purchases/create/', payload)
      .then(() => {
        toast.success('Purchase successful!')
        setPurchaseModal(false)
      })
      .catch((error) => {
        console.error(error)
        if (error.response && error.response.status === 400) {
          const errorDetail =
            error.response.data.installment_count ||
            error.response.data.first_installment_amount ||
            'An error occurred'

          setErrorMessage(errorDetail)
          toast.error(errorDetail)
        } else {
          setErrorMessage('Something went wrong while creating the purchase.')
          toast.error('Something went wrong while creating the purchase.')
        }
      })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      authAxios
        .delete(`/products/${id}/`)
        .then(() => {
          toast.success('Product deleted!')
          fetchProducts()
        })
        .catch((err) => {
          console.error(err)
          toast.error('Deletion failed. Please try again.')
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
        toast.success(editProduct ? 'Product updated!' : 'Product added!')
      })
      .catch((err) => {
        console.error(err)
        toast.error('Error saving product. Please try again.')
      })
  }

  return (
    <>

      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h4 className="mb-0">Product List</h4>
            <div className="small text-body-secondary">Available Products</div>
          </div>
          <CFormInput
            type="text"
            placeholder="Search by name or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
          {isAdmin && (
            <CButton color="success" onClick={handleAdd}>
              + Add Product
            </CButton>
          )}
        </CCardHeader>
        <CCardBody>
          <CRow>
            {filteredProducts.map((product) => (
              <CCol key={product.id} md={4} className="mb-4">
                <CCard className="h-100 shadow-sm">
                  <CCardBody>
                    <h5>{product.name}</h5>
                    <p>{product.description}</p>
                    <p><strong>Price:</strong> ৳{product.price}</p>
                    {isLoggedIn && (
                      <CButton color="primary" onClick={() => handlePurchase(product)}>
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

      {/* Modal for Purchase */}
      <CModal visible={purchaseModal} onClose={() => setPurchaseModal(false)}>
        <CModalHeader closeButton>
          <strong>Purchase Product</strong>
        </CModalHeader>
        <p className='d-flex text-muted mt-3 fw-bold justify-content-center'>Selected Product: {selectedProduct?.name} ( ৳{selectedProduct?.price} )</p>
        <CModalBody>
          <CForm>
            <CFormInput
              label="Quantity"
              type="number"
              min={1}
              value={purchaseForm.quantity}
              onChange={(e) =>
                setPurchaseForm({ ...purchaseForm, quantity: parseInt(e.target.value) || 1 })
              }
              className="mb-3"
            />
            <CFormInput
              label="First Installment Amount"
              type="number"
              min={0}
              value={purchaseForm.first_installment_amount}
              onChange={(e) =>
                setPurchaseForm({
                  ...purchaseForm,
                  first_installment_amount: parseFloat(e.target.value) || 0,
                })
              }
              className="mb-3"
            />
            <CFormInput
              label="Installment Count"
              type="number"
              min={1}
              value={purchaseForm.installment_count}
              onChange={(e) =>
                setPurchaseForm({
                  ...purchaseForm,
                  installment_count: parseInt(e.target.value) || 1,
                })
              }
              className="mb-3"
            />
            <div><strong>Total Price:</strong> ৳{totalPrice}</div>
            {errorMessage && (
              <div className="text-danger mt-2">
                <strong>{errorMessage}</strong>
              </div>
            )}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setPurchaseModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={submitPurchase}>
            Confirm Purchase
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Products
