import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAxios } from '../../axiosConfig';
import { FaCheckCircle, FaTimesCircle, FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

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
  CBadge,
} from '@coreui/react';

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    date_joined: '',
    is_verified: false,
  });
  const [originalUser, setOriginalUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authAxios.get('/accounts/profile/');
        setUser(response.data);
        setOriginalUser(response.data); // Store the original user data
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        toast.error('Error fetching user data');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const calculateDaysAgo = (date) => {
    const now = new Date();
    const joinedDate = new Date(date);
    const differenceInDays = Math.floor((now - joinedDate) / (1000 * 3600 * 24));

    if (differenceInDays < 30) {
      return `${differenceInDays} day${differenceInDays !== 1 ? 's' : ''} ago`;
    } else if (differenceInDays < 365) {
      const months = Math.floor(differenceInDays / 30);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(differenceInDays / 365);
      return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await authAxios.patch('/accounts/profile/', user);
      setUser((prevUser) => ({
        ...prevUser,
        ...response.data,
      }));
      setIsEditing(false);
      setOriginalUser(response.data); // Update the original user state with response data
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleCancel = () => {
    // Reset to original user data
    setUser({ ...originalUser });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <CContainer className="d-flex justify-content-center align-items-center vh-80">
        <CSpinner color="primary" size="xl" />
      </CContainer>
    );
  }

  if (error) {
    return <div className="text-danger text-center my-5">Error: {error}</div>;
  }

  return (
    <CContainer className="my-5">
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard className="shadow-lg border-0 rounded-3">
            <CCardHeader className="bg-primary text-white py-4 rounded-top-3 d-flex justify-content-between align-items-center">
              <h4 className="mb-0"><FaUser className="me-2" /> Profile Information</h4>
              <div>
                {user.is_verified ? (
                  <CBadge color="success" className="px-3 py-2 d-flex align-items-center gap-2 rounded-pill">
                    <FaCheckCircle /> Verified
                  </CBadge>
                ) : (
                  <CBadge color="danger" className="px-3 py-2 d-flex align-items-center gap-2 rounded-pill">
                    <FaTimesCircle /> Not Verified
                  </CBadge>
                )}
              </div>
            </CCardHeader>
            <CCardBody className="p-4">
              <CRow className="mb-4"> {/* Row for Username */}
                <CCol md={12}>
                  <CFormLabel htmlFor="username" className="fw-semibold"><FaUser className="me-2 text-muted" /> Username</CFormLabel>
                  <CFormInput type="text" id="username" value={user.username} disabled className="rounded-pill" />
                </CCol>
              </CRow>

              <CRow className="mb-4"> {/* Row for Email */}
                <CCol md={12}>
                  <CFormLabel htmlFor="email" className="fw-semibold"><FaEnvelope className="me-2 text-muted" /> Email</CFormLabel>
                  <CFormInput type="email" id="email" value={user.email} disabled className="rounded-pill" />
                </CCol>
              </CRow>

              <CRow className="mb-4"> {/* Row for First and Last Name */}
                <CCol md={6}>
                  <CFormLabel htmlFor="first_name" className="fw-semibold"><FaUser className="me-2 text-muted" /> First Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={user.first_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-pill"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="last_name" className="fw-semibold"><FaUser className="me-2 text-muted" /> Last Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={user.last_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-pill"
                  />
                </CCol>
              </CRow>

              <CRow className="mb-4"> {/* Row for Date Joined */}
                <CCol md={12}>
                  <CFormLabel htmlFor="date_joined" className="fw-semibold"><FaCalendarAlt className="me-2 text-muted" /> Date Joined</CFormLabel>
                  <CFormInput
                    type="text"
                    id="date_joined"
                    value={calculateDaysAgo(user.date_joined)}
                    disabled
                    className="rounded-pill"
                  />
                </CCol>
              </CRow>

              <div className="d-flex justify-content-end gap-3 mt-4">
                {isEditing && (
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
                      onClick={handleProfileUpdate}
                      className="rounded-pill px-4"
                    >
                      <FaSave className="me-2" /> Save Changes
                    </CButton>
                  </>
                )}

                {!isEditing && (
                  <CButton
                    color="primary"
                    onClick={() => setIsEditing(true)}
                    className="rounded-pill px-4"
                  >
                    <FaEdit className="me-2" /> Edit Profile
                  </CButton>
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Profile;
