import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

import { AuthProvider } from './auth/AuthContext.jsx'
import ProtectedRoute from './auth/ProtectedRoute'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    setColorMode(storedTheme)
    if (theme) setColorMode(theme)
    if (isColorModeSet()) return
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const CustomerPublicView = React.lazy(() => import('./views/customer/CustomerViewIndex'))

  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/404" element={<Page404 />} />
            <Route path="/500" element={<Page500 />} />
            <Route path="/customer/view/:id" element={<CustomerPublicView />} />
            {/* Everything else requires auth */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <DefaultLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
