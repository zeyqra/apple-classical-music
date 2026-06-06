import axios from 'axios'
import { logout } from './auth'

const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

service.interceptors.response.use(
  res => res.data,
  async error => {
    if (error.response?.status === 401) logout()

    return Promise.reject(error)
  }
)

export default service
