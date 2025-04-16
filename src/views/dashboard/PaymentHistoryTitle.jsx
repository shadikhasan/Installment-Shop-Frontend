import React, { useEffect, useState } from 'react'
import { CCol } from '@coreui/react'
import axios from 'axios'
import { authAxios } from '../../axiosConfig'

const PaymentHistoryTitle = () => {
  const [monthRange, setMonthRange] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authAxios
      .get('/reports/chart/summary/')
      .then((response) => {
        const labels = response.data.labels

        // Extract the first and last month from the labels array
        if (labels.length > 0) {
          const startMonth = labels[0] // First month
          const endMonth = labels[labels.length - 1] // Last month
          setMonthRange(`${startMonth} - ${endMonth} 2025`)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setLoading(false)
      })
  }, [])

  return (
    <CCol>
      <h4 id="traffic" className="card-title mb-0">
        Payment History
      </h4>
      <div className="small text-body-secondary">{loading ? 'Loading...' : monthRange}</div>
    </CCol>
  )
}

export default PaymentHistoryTitle
