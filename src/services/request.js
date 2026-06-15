import axios from 'axios'
import { logout } from './user'

const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

service.interceptors.request.use(config => {
  const cookie = localStorage.getItem('cookie')
  if (cookie) {
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        cookie,
      }
    }
    if (config.method === 'post') {
      config.data = {
        ...config.data,
        cookie,
      }
    }
  }

  if (config.method === 'post') {
    config.url += `${config.url.includes('?') ? '&' : '?'}timestamp=${Date.now()}`
  }

  return config
})

service.interceptors.response.use(
  res => res.data,
  async error => {
    if (error.response?.status === 401) logout()
    if (error.response?.data?.code)
      alert(error.response?.data?.code + ': ' + error.response?.data?.message)
    return Promise.reject(error)
  }
)

export default service
