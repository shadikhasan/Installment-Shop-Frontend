import React from 'react'
import classNames from 'classnames'

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
import GlobalSummary from '../../components/GlobalSummary'
import PaymentHistoryTitle from './PaymentHistoryTitle'
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const isAdmin = localStorage.getItem('is_superuser') === 'true'
  return (
    <>
      {isAdmin && <GlobalSummary />}
      {!isAdmin && <UserSummary />}
      {isAdmin && <UserStatsChart />}
      <CCard className="mb-4 mt-4">
        <CCardBody>
          <CRow>
            <PaymentHistoryTitle/> 
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
      
            </CCol>
          </CRow>
          <MainChart />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
