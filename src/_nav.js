import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPuzzle,
  cilSpeedometer,
  cilMemory,
  cilUser,
  cilApps,
  cibMicrosoft,
  cilCart,
  cilXCircle,
  cilSettings,
  cilHome,
  cilHistory
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
   {
    component: CNavGroup,
    name: 'Home',
    to: '/home',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
      },
    ],
  },

  
  {
    component: CNavGroup,
    name: 'Sale',
    to: '/sale',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registration',
        to: '/sale/registration',
      },
      {
        component: CNavItem,
        name: 'List',
        to: '/sale/list',
      },
    ],
  },
 
  {
    component: CNavGroup,
    name: 'Store',
    to: '/store',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Raw Material',
        to: '/store/raw-material',
      }
    ],
  },

 
  {
    component: CNavGroup,
    name: 'Menu',
    to: '/menu',
    icon: <CIcon icon={cibMicrosoft} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registration',
        to: '/menu/register',
      },
      {
        component: CNavItem,
        name: 'List',
        to: '/menu/List',
      }
    ],
  },
  


  {
    component: CNavGroup,
    name: 'User',
    to: '/user',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registration',
        to: '/user/register',
       
      },
      {
        component: CNavItem,
        name: 'List',
        to: '/user/list',
      },
      {
        component: CNavItem,
        name: 'Reset Password',
        to: '/user/reset-password',
      },
    ],
  },

 {
    component: CNavGroup,
    name: 'Setting',
    to: '/setting',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Setting',
        to: '/setting',
       
      }
    ],
  },

  {
    component: CNavGroup,
    name: 'History',
    to: '/history',
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'History',
        to: '/history',
       
      }
    ],
  },
  
  {
    component: CNavTitle,
    name: 'Storage',
  },
  {
    component: CNavItem,
    name: 'Database Storage',
    to: '/storage',
    icon: <CIcon icon={cilMemory} customClassName="nav-icon" />,
  },
]

export default _nav
