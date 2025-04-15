import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cibOpenAccess,
  cibProductHunt,
  cilBell,
  cilChartPie,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

// This function returns the navigation based on login status
const getNav = () => {
  const isLoggedIn = localStorage.getItem('access_token') !== null
  const isAdmin = localStorage.getItem('is_superuser') === 'true'

  return [
    ...(isAdmin ? [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        badge: {
          color: 'info',
          text: 'ADMIN',
        },
      },
    ] : []),
    {
      component: CNavTitle,
      name: 'Components',
    },
    {
      component: CNavItem,
      name: 'Charts',
      to: '/charts',
      icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Products',
      to: '/products',
      icon: <CIcon icon={cibProductHunt} customClassName="nav-icon" />,
    },
    ...(isLoggedIn ? [
      {
        component: CNavItem,
        name: 'Installments',
        to: '/installments',
        icon: <CIcon icon={cibProductHunt} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Purchases',
        to: '/purchase',
        icon: <CIcon icon={cibProductHunt} customClassName="nav-icon" />,
      },
      {
        component: CNavGroup,
        name: 'Notifications',
        icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Alerts',
            to: '/notifications/alerts',
          },
          {
            component: CNavItem,
            name: 'Badges',
            to: '/notifications/badges',
          },
          {
            component: CNavItem,
            name: 'Modal',
            to: '/notifications/modals',
          },
          {
            component: CNavItem,
            name: 'Toasts',
            to: '/notifications/toasts',
          },
        ],
      },
    ] : []),
    {
      component: CNavTitle,
      name: 'Extras',
    },
    {
      component: CNavGroup,
      name: 'Pages',
      icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Error 404',
          to: '/404',
        },
        {
          component: CNavItem,
          name: 'Error 500',
          to: '/500',
        },
      ],
    },
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
