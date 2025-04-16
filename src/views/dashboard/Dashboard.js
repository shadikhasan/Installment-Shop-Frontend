import React from 'react'
import classNames from 'classnames'
import { Container, Button, Card, Row, Col } from 'react-bootstrap'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import UserStatsChart from '../../components/UserStatsChart'
import UserSummary from './../../components/UserSummary'
import GlobalSummary from '../../components/TotalProducts'
import PaymentHistoryTitle from './PaymentHistoryTitle'
import { Link } from 'react-router-dom'
import TotalProducts from '../../components/TotalProducts'
import TotalProductCategories from '../../components/TotalProductCategories'


const Dashboard = () => {
  const isAdmin = localStorage.getItem('is_superuser') === 'true'
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

      {!isAdmin && <UserSummary />}

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
