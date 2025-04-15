// src/components/AdminRoute.js
import React from 'react'
import { Navigate } from 'react-router-dom'

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('access_token')
  const isAdmin = localStorage.getItem('is_superuser') === 'true'

  return token && isAdmin ? children : <Navigate to="/404" replace />
}

export default AdminRoute
