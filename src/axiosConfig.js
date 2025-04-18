// axiosConfig.js
import axios from 'axios'

const baseUrl = "https://installmentshop-production.up.railway.app/"

// Public axios instance (without token)
const publicAxios = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Authenticated axios instance (with token)
const authAxios = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Adding the token to the headers for authAxios when available
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { publicAxios, authAxios, baseUrl }
