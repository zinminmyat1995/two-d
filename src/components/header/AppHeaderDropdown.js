// src/components/header/AppHeaderDropdown.jsx
import React, { useState } from 'react'
import {
  CDropdown, CDropdownDivider, CDropdownHeader,
  CDropdownItem, CDropdownMenu, CDropdownToggle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAccountLogout, cilUser } from '@coreui/icons'
import { useAuth } from '../../auth/AuthContext'   // path ကိုစစ်ပါ: ./../../auth/AuthContext

const AppHeaderDropdown = () => {
  const [name] = useState(localStorage.getItem('NAME'))
  const { logout } = useAuth()

  const handleLogout = async (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    console.log('[AppHeaderDropdown] logout clicked')  // DEBUG
    await logout()
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0 mb-1" caret={false}>
        <CIcon icon={cilUser} className="me-2 mt-2" style={{ color: '#3c658c' }} />
      </CDropdownToggle>

      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Profile</CDropdownHeader>

        <CDropdownItem disabled>
          <CIcon icon={cilUser} className="me-2" />
          {name || 'Admin'}
        </CDropdownItem>

        <CDropdownDivider />

        {/* ✅ MOST IMPORTANT: render as button (no href) */}
        <CDropdownItem component="button" type="button" onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
