import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { publicAxios } from '../../../axiosConfig'
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CRow, CFormInput } from '@coreui/react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaLock, FaCheckCircle } from 'react-icons/fa'

const OtpVerify = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const email = location.state?.email || ''
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [error, setError] = useState('')

  // 🚫 Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      navigate('/dashboard') // Redirect to a protected route
    }
  }, [navigate])

  const handleOtpChange = (e, index) => {
    const value = e.target.value
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus()
      }
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const otpCode = otp.join('')

    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit OTP')
      return
    }

    try {
      await publicAxios.post('/accounts/verify-otp/', { email, otp_code: otpCode })
      toast.success('OTP Verified Successfully! Please Login')
      navigate('/login')
    } catch (error) {
      toast.error('OTP verification failed: ' + (error.response?.data || error.message))
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="shadow border-0 rounded-4">
              <CCardBody className="p-5">
                <CForm onSubmit={handleVerify}>
                  <h1 className="text-center mb-4">
                    <FaLock className="me-2 text-primary" />
                    Verify OTP
                  </h1>
                  <p className="text-center text-muted mb-4">
                    Enter the OTP sent to <strong>{email}</strong>
                  </p>

                  <div className="d-flex justify-content-between mb-3">
                    {otp.map((digit, index) => (
                      <CFormInput
                        key={index}
                        type="text"
                        id={`otp-${index}`}
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        maxLength="1"
                        required
                        autoFocus={index === 0}
                        placeholder="–"
                        className="text-center fs-4 fw-bold rounded-3"
                        style={{
                          width: '55px',
                          height: '55px',
                          fontSize: '24px',
                        }}
                      />
                    ))}
                  </div>

                  {error && <div className="text-danger text-center fw-semibold mb-3">{error}</div>}

                  <div className="text-center mt-3">
                    <CButton
                      type="submit"
                      color="primary"
                      className="shadow fw-bold rounded-3 px-5 py-2"
                    >
                      <FaCheckCircle className="me-2" />
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
