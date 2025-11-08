import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { attachUnauthHandler } from '../service/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    try { return raw ? JSON.parse(raw) : null } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  // --- Login (example for /user/login). Admin flow ဆိုရင် path ပြောင်းပါ ---
  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/user/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e?.response?.data?.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const hardLocalLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    navigate('/login', { replace: true })
  }

  const logout = async () => {
    console.log('[AuthContext] logout() called') // DEBUG
    try {
      const t = localStorage.getItem('token')
      if (t) {
        await api.post('/user/logout') // admin flow ဆိုရင် '/admin/logout'
      }
    } catch (_) {
      // ignore
    } finally {
      hardLocalLogout()
    }
  }

  useEffect(() => {
    attachUnauthHandler(() => hardLocalLogout())
  }, [])

  const value = useMemo(() => ({
    token, user, loading, login, logout, isAuthenticated: !!token
  }), [token, user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
