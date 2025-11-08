import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilClipboard,
  cilCash,
  cilFile,
  cilStorage,
  cilFastfood,
  cilUserPlus,
  cilUser,
  cilLockLocked,
  cilSettings,
  cilHistory,
  cilBasket ,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // 🏠 Dashboard
  {
    component: CNavGroup,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Overview',
        to: '/dashboard',
      },
    ],
  },

  // 💳 Billing Section
  {
    component: CNavGroup,
    name: 'Billing & Orders',
    to: '/billing',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Settle Payment',
        to: '/billing/register',
      },
      {
        component: CNavItem,
        name: 'Order List',
        to: '/billing/list',
      },
    ],
  },

  // 🏪 Store Section
  {
    component: CNavGroup,
    name: 'Inventory',
    to: '/store',
    icon: <CIcon icon={cilBasket } customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Raw Materials',
        to: '/store/raw-material',
      },
    ],
  },

  // 🍽 Menu Section
  {
    component: CNavGroup,
    name: 'Menu Management',
    to: '/menu',
    icon: <CIcon icon={cilFastfood} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Create Menu',
        to: '/menu/register',
      },
      {
        component: CNavItem,
        name: 'Menu List',
        to: '/menu/list',
      },
      {
        component: CNavItem,
        name: 'Daily Menu Plan',     
        to: '/menu/daily-plan',
      },
    ],
  },

  // 👤 User Management
  {
    component: CNavGroup,
    name: 'User Management',
    to: '/user',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add New User',
        to: '/user/register',
      },
      {
        component: CNavItem,
        name: 'User List',
        to: '/user/list',
      },
      {
        component: CNavItem,
        name: 'Reset Password',
        to: '/user/reset-password',
      },
    ],
  },

  // ⚙️ Settings
  {
    component: CNavGroup,
    name: 'System Settings',
    to: '/setting',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'General Settings',
        to: '/setting',
      },
    ],
  },

  // 🕑 Activity Log
  {
    component: CNavGroup,
    name: 'Activity Logs',
    to: '/history',
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Action History',
        to: '/history',
      },
    ],
  },

  // 💾 Storage
  {
    component: CNavTitle,
    name: 'Storage',
  },
  {
    component: CNavItem,
    name: 'Database Usage',
    to: '/storage',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },
]

export default _nav
