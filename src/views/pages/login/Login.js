import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

import ApiPath from '../../common/ApiPath'
import { ApiRequest } from '../../common/ApiRequest'
import Loading from '../../common/Loading'
import Message from '../../common/SuccessError'

const Login = () => {
  const navigate = useNavigate()
  const [error, setError] = useState([])     // for error message
  const [success, setSuccess] = useState([]) // for success message
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [loginType, setLoginType] = useState(0)

  useEffect(() => {
    // fresh login session
    localStorage.removeItem('token')
    localStorage.removeItem('ADMIN')
    localStorage.removeItem('LOGIN_ID')
    localStorage.removeItem('ROLE')
    localStorage.removeItem('NAME')
    localStorage.removeItem('LOGIN_TYPE')

    // coreui theme keep
    localStorage.setItem('coreui-free-react-admin-template-theme', 'light')
  }, [])

  const validate = () => {
    const errs = []
    if (!code?.trim()) errs.push('Please fill code!')
    if (!password?.trim()) errs.push('Please fill password!')
    return errs
  }

  const loginClick = async () => {
    const errs = validate()
    if (errs.length) {
      setError(errs)
      setSuccess([])
      return
    }

    setError([])
    setSuccess([])
    setLoading(true)

    // IMPORTANT: ApiPath.Login ကို /admin/login သို့ပြောင်းထားပါ
    // e.g. ApiPath.Login = '/admin/login'
    const res = await ApiRequest({
      method: 'post',
      url: ApiPath.Login,
      params: { code, password },
    })

    setLoading(false)

    if (res.flag === false) {
      // ApiRequestErrorHandler ရဲ့ message array ကိုပြ
      setError(Array.isArray(res.message) ? res.message : [res.message || 'Login failed'])
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      return
    }

    const data = res?.data

    if (data?.status === 'OK' && data?.token) {
      // ✅ store token for axios instance (api.js) to pick up
      localStorage.setItem('token', data.token)

      // optional but useful
      if (data?.admin) {
        localStorage.setItem('ADMIN', JSON.stringify(data.admin))
        localStorage.setItem('LOGIN_ID', data.admin.code ?? code)
        localStorage.setItem('ROLE', data.admin.role ?? '')
        localStorage.setItem('NAME', data.admin.name ?? '')
      } else {
        // backward-compat (အဟောင်း controller – role/name သာပို့လာတာ)
        localStorage.setItem('LOGIN_ID', code)
        localStorage.setItem('ROLE', data.role ?? '')
        localStorage.setItem('NAME', data.name ?? '')
      }

      localStorage.setItem('LOGIN_TYPE', loginType)

      setSuccess(['Login Successfully!'])
      // redirect by loginType
      if (loginType === 0) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/match/dashboard', { replace: true })
      }
    } else {
      // controller အဟောင်းရဲ့ format ကိုလည်း handle
      const msg = data?.message || 'Admin ID or Password is incorrect!'
      setError([msg])
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      loginClick()
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center login-background-image">
      <Loading start={loading} />
      <CContainer>
        <CRow>
          <CCol md={5} className="login-card-design">
            <CForm style={{ marginTop: '50%' }}>
              <h1 className="title">Restaurant</h1>
              <div style={{ marginLeft: '12px', marginRight: '12px' }}>
                <Message success={success} error={error} />
              </div>

              <CInputGroup className="mb-3 mt-3">
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  placeholder="User Code"
                  autoComplete="username"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={onEnter}
                />
              </CInputGroup>

              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={onEnter}
                />
              </CInputGroup>

              <CRow className="text-align-center">
                <CCol>
                  <CButton className="px-4 login-button" onClick={loginClick}>
                    Login
                  </CButton>
                </CCol>
              </CRow>

              <CRow className="text-align-center">
                <CCol>
                  <CButton color="link" className="px-0 forgot-password-link">
                    Forgot password?
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
