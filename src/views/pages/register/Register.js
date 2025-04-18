import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { publicAxios } from '../../../axiosConfig'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppHeader } from '../../../components'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  // 🚫 Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      navigate('/dashboard') // Change this to your default logged-in route
    }
  }, [navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await publicAxios.post('/accounts/register/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log('Registration successful:', response.data)
      toast.success('Registration successful! Check your email for OTP.')
      navigate('/otp-verify', { state: { email: formData.email } })
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message)
      toast.error('Registration failed: ' + (error.response?.data || error.message))
    }
  }

  return (
    <>
    <AppHeader />
    <div className="mt-5">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              {/* Form Card */}
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Register</h1>
                    <p className="text-body-secondary">Create your account</p>

                    {/* Username */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        name="username"
                        placeholder="Username"
                        autoComplete="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </CInputGroup>

                    {/* Email */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        name="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </CInputGroup>

                    {/* Password */}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        name="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </CInputGroup>

                    {/* Submit Button */}
                    <CRow>
                      <CCol xs={12}>
                        <CButton type="submit" color="success" className="w-100 fw-bold">
                          Create Account
                        </CButton>
                      </CCol>
                    </CRow>

                    {/* Login Redirect */}
                    <CRow className="mt-3">
                      <CCol className="text-center">
                        <small className="text-muted">
                          Already have an account?{' '}
                          <Link to="/login" className="text-primary fw-semibold">
                            Login here
                          </Link>
                        </small>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

              {/* Right Side Info Panel */}
              <CCard className="text-white bg-success py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Welcome!</h2>
                    <p>
                      Join us and start your journey. Fill in the details and check your email for
                      the OTP to complete registration.
                    </p>
                    <Link to="/login">
                      <CButton color="light" className="mt-3 text-success fw-bold" tabIndex={-1}>
                        Back to Login
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
    </>
  )
}

export default Register
