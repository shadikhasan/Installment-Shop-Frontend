// src/components/PrivateRoute.js

import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token') // Or from Redux if stored there

  return token ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
