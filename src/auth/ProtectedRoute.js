import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token') // 🟢 AuthContext/api.js နဲ့တူရ
  const location = useLocation()
  if (!token) {
    return <Navigate to="/login" replace state={{ redirectTo: location.pathname + location.search }} />
  }
  return children
}
