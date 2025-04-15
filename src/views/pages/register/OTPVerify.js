import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { authAxios, publicAxios } from '../../../axiosConfig'
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
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
      const response = await publicAxios.post('/accounts/verify-otp/', {
        email: email,
        otp_code: otp,
      })
      console.log('OTP verified:', response.data)
      toast.success('OTP Verified Successfully!')  // Success notification
      navigate('/login')
    } catch (error) {
      console.error('OTP verification failed:', error.response?.data || error.message)
      toast.error('OTP verification failed: ' + (error.response?.data || error.message))  // Error notification
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

      {/* Add the ToastContainer here */}
      <ToastContainer />
    </div>
  )
}

export default OtpVerify
