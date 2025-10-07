import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Outlet, useLocation, Navigate } from 'react-router-dom'

const DefaultLayout = () => {
  const location = useLocation()
  

  // Order Register route စစ်ခြင်း
  const isOrderRegister = location.pathname.startsWith('/order/register')

  return (
    <div>
      <AppSidebar />
        <div className={`wrapper d-flex flex-column min-vh-100 `} style={{ background: `${isOrderRegister ? '#fbfbfb' : ''}`   }}>
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
