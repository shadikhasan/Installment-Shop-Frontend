import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cibOpenAccess,
  cibProductHunt,
  cilBell,
  cilBellExclamation,
  cilChartPie,
  cilSpeedometer,
  cilStar,
  cilCart ,
  cilMoney,
  cilCreditCard,
  cilLaptop,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { FaConciergeBell, FaMoneyBill, FaBoxOpen   } from 'react-icons/fa'

// This function returns the navigation based on login status
const getNav = () => {
  const isLoggedIn = localStorage.getItem('access_token') !== null
  const isAdmin = localStorage.getItem('is_superuser') === 'true'

  return [
    ...(isLoggedIn ? [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        badge: {
          color: 'info',
          text: 'New',
        },
      },
    ] : []),
    {
      component: CNavTitle,
      name: 'Components',
    },
    {
      component: CNavItem,
      name: 'Products',
      to: '/products',
      icon: <CIcon icon={cilLaptop   } customClassName="nav-icon" />,
    },
    ...(isLoggedIn ? [
      {
        component: CNavItem,
        name: 'Installments',
        to: '/installments',
        icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Purchases',
        to: '/purchase',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
      },
    ] : []),
    {
      component: CNavTitle,
      name: 'Extras',
    },
    ...(isAdmin ? [
      {
        component: CNavItem,
        name: 'Reports',
        to: '/reports',
        icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
      },
    ] : []),
    ...(isAdmin ? [
      {
        component: CNavItem,
        name: 'Full Admin Access',
        to: 'http://127.0.0.1:8000/admin',
        icon: <CIcon icon={cibOpenAccess} customClassName="nav-icon" />,
      },
    ] : []),
  ]
}

export default getNav()
