import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { authAxios } from '../../axiosConfig' // Assuming you have an axios instance for authorization
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CFormLabel,
  CSpinner,
} from '@coreui/react'

const Profile = () => {
  const navigate = useNavigate()

  // State to store user data and original data
  const [user, setUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    date_joined: '',
  })
  const [originalUser, setOriginalUser] = useState({}) // Store original user data for cancel

  // State for loading, error, and edit mode
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)  // Toggle edit mode

  // Load user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authAxios.get('/accounts/profile/')
        setUser(response.data)
        setOriginalUser(response.data)  // Save the original user data
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
        toast.error('Error fetching user data')
        navigate('/login') // Redirect to login if fetching fails
      }
    }

    fetchUserData()
  }, [navigate])

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      const response = await authAxios.put('/api/accounts/profile/', user, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      setUser(response.data)
      setIsEditing(false)  // Switch to view mode after update
      setOriginalUser(response.data) // Update original data after success
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error updating profile')
    }
  }

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
  }

  // Reset user data to the original state
  const handleCancel = () => {
    setUser(originalUser)  // Reset the form to its original values
    setIsEditing(false)  // Switch back to view mode
  }

  if (loading) {
    return (
      <CContainer className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <CSpinner color="primary" size="xl" />
      </CContainer>
    ) // Stylish loading spinner
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <CContainer className="my-4">
      <CRow>
        <CCol md={8} className="offset-md-2">
          <CCard className="shadow-lg rounded-4">
            <CCardHeader className="bg-primary text-white rounded-top-4">
              <h5>Profile Information</h5>
            </CCardHeader>
            <CCardBody>
              <form>
                <CRow>
                  <CCol md={6}>
                    <CFormLabel htmlFor="username">Username</CFormLabel>
                    <CFormInput
                      type="text"
                      id="username"
                      name="username"
                      value={user.username}
                      disabled
                      className="mb-3"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="email">Email</CFormLabel>
                    <CFormInput
                      type="email"
                      id="email"
                      name="email"
                      value={user.email}
                      disabled
                      className="mb-3"
                    />
                  </CCol>
                </CRow>

                <CRow className="mt-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="first_name">First Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={user.first_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mb-3"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="last_name">Last Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={user.last_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mb-3"
                    />
                  </CCol>
                </CRow>

                <CRow className="mt-3">
                  <CCol md={12}>
                    <CFormLabel htmlFor="date_joined">Date Joined</CFormLabel>
                    <CFormInput
                      type="text"
                      id="date_joined"
                      name="date_joined"
                      value={new Date(user.date_joined).toLocaleDateString()}
                      disabled
                      className="mb-3"
                    />
                  </CCol>
                </CRow>

                {/* Action buttons: Edit/Update and Cancel */}
                <div className="d-flex justify-content-between">
                  <CButton
                    color={isEditing ? "success" : "primary"}
                    className="mt-4 w-48 py-2 rounded-3 shadow-sm"
                    onClick={() => {
                      if (isEditing) {
                        handleProfileUpdate()
                      } else {
                        setIsEditing(true)
                      }
                    }}
                    style={{
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '')}
                  >
                    {isEditing ? "Update Profile" : "Edit Profile"}
                  </CButton>

                  {isEditing && (
                    <CButton
                      color="secondary"
                      className="mt-4 w-48 py-2 rounded-3 shadow-sm"
                      onClick={handleCancel}
                      style={{
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseOver={(e) => (e.target.style.backgroundColor = '#6c757d')}
                      onMouseOut={(e) => (e.target.style.backgroundColor = '')}
                    >
                      Cancel
                    </CButton>
                  )}
                </div>
              </form>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Profile
