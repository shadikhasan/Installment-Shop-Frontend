import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col } from 'react-bootstrap'

import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'

import TotalProducts from '../../components/TotalProducts'
import TotalProductCategories from '../../components/TotalProductCategories'
import UserStatsChart from '../../components/UserStatsChart'
import UserSummary from './../../components/UserSummary'
import PaymentHistoryTitle from './PaymentHistoryTitle'
import MainChart from './MainChart'

const Dashboard = () => {
  const navigate = useNavigate() // For redirection
  const isAdmin = localStorage.getItem('is_superuser') === 'true'
  const isLoggedIn = !!localStorage.getItem('access_token')

  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to /products if user is not logged in
      navigate('/products')
    }
  }, [isLoggedIn, navigate])

  return (
    <>
      {isAdmin && (
        <Card className="h-60 shadow-sm">
          <Row className="mb-4">
            <Col md={4}>
              <div className="d-flex flex-column mx-3 justify-content-between h-100">
                <div className='mt-3'><TotalProducts /></div>
                <div className='mb-4'><TotalProductCategories /></div>
              </div>
            </Col>
            <Col md={8}>
              <div className="h-60">
                <UserStatsChart />
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {!isAdmin && isLoggedIn && <UserSummary />}

      {isAdmin && (
        <CCard className="mb-4 mt-4">
          <CCardBody>
            <CRow>
              <PaymentHistoryTitle />
              <CCol sm={7} className="d-none d-md-block">
                <CButton color="primary" className="float-end">
                  <CIcon icon={cilCloudDownload} />
                </CButton>
              </CCol>
            </CRow>
            <MainChart />
          </CCardBody>
        </CCard>
      )}
    </>
  )
}

export default Dashboard
