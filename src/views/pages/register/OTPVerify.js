import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilShieldAlt } from '@coreui/icons'

const OtpVerify = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''

  const [otp, setOtp] = useState('')

  useEffect(() => {
    if (!email) {
      alert('Email not found! Please register again.')
      navigate('/register')
    }
  }, [email, navigate])

  const handleVerify = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/verify-otp/', {
        email: email,
        otp_code: otp,
      })
      console.log('OTP verified:', response.data)
      alert('OTP Verified Successfully!')
      navigate('/login')
    } catch (error) {
      console.error('OTP verification failed:', error.response?.data || error.message)
      alert('OTP verification failed: ' + JSON.stringify(error.response?.data))
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleVerify}>
                  <h1>Verify OTP</h1>
                  <p className="text-body-secondary">
                    Enter the OTP sent to <strong>{email}</strong>
                  </p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilShieldAlt} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton type="submit" color="primary">
                      Verify
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default OtpVerify
