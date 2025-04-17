import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authAxios } from '../../axiosConfig'
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from 'react-icons/fa'
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CFormInput,
  CFormLabel,
  CSpinner,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
} from '@coreui/react'

const Profile = () => {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(true)
  const [user, setUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    date_joined: '',
    is_verified: false,
  })
  const [originalUser, setOriginalUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const firstNameRef = useRef(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await authAxios.get('/accounts/profile/')
        setUser(res.data)
        setOriginalUser(res.data)
        setLoading(false)
      } catch (err) {
        toast.error('Error fetching user data')
        navigate('/login')
      }
    }

    fetchUserData()
  }, [navigate])

  const calculateDaysAgo = (date) => {
    const now = new Date()
    const joined = new Date(date)
    const diff = Math.floor((now - joined) / (1000 * 3600 * 24))
    if (diff < 30) return `${diff} day${diff !== 1 ? 's' : ''} ago`
    if (diff < 365) return `${Math.floor(diff / 30)} month${diff < 60 ? '' : 's'} ago`
    return `${Math.floor(diff / 365)} year${diff < 730 ? '' : 's'} ago`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async () => {
    try {
      // Exclude is_verified and date_joined from the update data
      const { is_verified, date_joined, ...updatedUser } = user

      // Make the API request without is_verified and date_joined
      const res = await authAxios.patch('/accounts/profile/', updatedUser)

      // Preserve is_verified and date_joined from originalUser
      setUser({
        ...res.data,
        is_verified: originalUser.is_verified, // Ensure is_verified stays the same
        date_joined: originalUser.date_joined, // Ensure date_joined stays the same
      })

      // Update the originalUser state to the updated user data
      setOriginalUser(res.data)

      // Turn off editing mode
      setIsEditing(false)

      toast.success('Profile updated!')
    } catch (err) {
      toast.error('Update failed.')
    }
  }

  const handleCancel = () => {
    // Reset user state to originalUser but keep is_verified and date_joined intact
    setUser({
      ...originalUser,
      is_verified: originalUser.is_verified,
      date_joined: originalUser.date_joined,
    })
    setIsEditing(false)
  }

  const isChanged = JSON.stringify(user) !== JSON.stringify(originalUser)

  useEffect(() => {
    if (isEditing && firstNameRef.current) {
      firstNameRef.current.focus()
    }
  }, [isEditing])

  return (
    <CModal
      className="mt-5"
      visible={visible}
      onClose={() => {
        setVisible(false)
        navigate(-1)
      }}
      size="lg"
      scrollable
    >
      <CModalHeader className="sticky-top bg-white shadow-sm">
        <CModalTitle className="d-flex align-items-center gap-2">
          <FaUser /> Profile
        </CModalTitle>
        <CBadge
          color={user.is_verified ? 'success' : 'danger'}
          className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
        >
          {user.is_verified ? <FaCheckCircle /> : <FaTimesCircle />}
          {user.is_verified ? 'Verified' : 'Not Verified'}
        </CBadge>
      </CModalHeader>

      <CModalBody className="py-4">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '200px' }}
          >
            <CSpinner color="primary" size="lg" />
          </div>
        ) : error ? (
          <div className="text-danger text-center">{error}</div>
        ) : (
          <CContainer fluid>
            {/* BASIC INFO */}
            <h5 className="text-muted mb-3">Basic Info</h5>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Username</CFormLabel>
                <CFormInput value={user.username} disabled className="rounded-pill" />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Email</CFormLabel>
                <CFormInput value={user.email} disabled className="rounded-pill" />
              </CCol>
            </CRow>

            {/* EDITABLE FIELDS */}
            <h5 className="text-muted mt-4 mb-3">Personal Info</h5>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>First Name</CFormLabel>
                <CFormInput
                  name="first_name"
                  value={user.first_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="rounded-pill"
                  ref={firstNameRef}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Last Name</CFormLabel>
                <CFormInput
                  name="last_name"
                  value={user.last_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="rounded-pill"
                />
              </CCol>
            </CRow>

            {/* JOINED */}
            <h5 className="text-muted mt-4 mb-3">Account Info</h5>
            <CRow className="mb-4">
              <CCol md={12}>
                <CFormLabel>Joined</CFormLabel>
                <CFormInput
                  value={calculateDaysAgo(user.date_joined)}
                  disabled
                  className="rounded-pill"
                />
              </CCol>
            </CRow>

            {/* ACTIONS */}
            <div className="d-flex justify-content-end gap-3">
              {isEditing ? (
                <>
                  <CButton
                    color="secondary"
                    variant="outline"
                    onClick={handleCancel}
                    className="rounded-pill px-4"
                  >
                    <FaTimes className="me-2" /> Cancel
                  </CButton>
                  <CButton
                    color="success"
                    onClick={handleUpdate}
                    disabled={!isChanged}
                    className="rounded-pill px-4"
                  >
                    <FaSave className="me-2" /> Save
                  </CButton>
                </>
              ) : (
                <CButton
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  className="rounded-pill px-4"
                >
                  <FaEdit className="me-2" /> Edit
                </CButton>
              )}
            </div>
          </CContainer>
        )}
      </CModalBody>
    </CModal>
  )
}

export default Profile
