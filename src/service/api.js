import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://new-six-back.vercel.app/v1',  //https://new-six-back.vercel.app/v1   http://127.0.0.1:8000/api
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')   // <-- key ယူဆ: 'token'
  if (token) config.headers.Authorization = `Bearer ${token}`
  else delete config.headers.Authorization
  config.headers.Accept = 'application/json'
  return config
})

let isHandling401 = false
export function attachUnauthHandler(onUnauthorized) {
  api.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status
      const url = error?.config?.url || ''
      if (status === 401) {
        // logout endpoint ကို 401 loop မဖြစ်အောင်တာ
        if (!isHandling401 && !url.endsWith('/user/logout') && !url.endsWith('/admin/logout')) {
          isHandling401 = true
          try { onUnauthorized?.() } finally { isHandling401 = false }
        }
      } else if (status === 404) {
        window.location.href = `${window.location.origin}/404`; return
      } else if (status === 403) {
        window.location.href = `${window.location.origin}/403`; return
      }
      return Promise.reject(error)
    }
  )
}

export default api
