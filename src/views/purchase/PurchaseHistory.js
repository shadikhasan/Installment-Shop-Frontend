import React, { useEffect, useState } from 'react'
import { authAxios } from '../../axiosConfig'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CSpinner
} from '@coreui/react'

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authAxios
      .get('/purchases/my/')
      .then((res) => setPurchases(res.data))
      .catch((err) => console.error('Failed to fetch purchases:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>My Purchase History</strong>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <div className="text-center">
            <CSpinner color="primary" />
          </div>
        ) : purchases.length === 0 ? (
          <p>You haven’t made any purchases yet.</p>
        ) : (
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Product ID</CTableHeaderCell>
                <CTableHeaderCell>Product Name</CTableHeaderCell>
                <CTableHeaderCell>Quantity</CTableHeaderCell>
                <CTableHeaderCell>Total Price</CTableHeaderCell>
                <CTableHeaderCell>First Installment</CTableHeaderCell>
                <CTableHeaderCell>Installments</CTableHeaderCell>
                <CTableHeaderCell>Purchase Date</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {purchases.map((item, index) => (
                <CTableRow key={item.id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.product}</CTableDataCell>
                  <CTableDataCell>{item.product_name}</CTableDataCell>
                  <CTableDataCell>{item.quantity}</CTableDataCell>
                  <CTableDataCell>৳{item.total_price}</CTableDataCell>
                  <CTableDataCell>৳{item.first_installment_amount}</CTableDataCell>
                  <CTableDataCell>{item.installment_count}</CTableDataCell>
                  <CTableDataCell>{new Date(item.purchase_date).toLocaleString()}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  )
}

export default PurchaseHistory
