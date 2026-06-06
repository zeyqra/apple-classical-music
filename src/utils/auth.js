import { redirect } from 'react-router-dom'
import queryClient from './queryClient'

export const requireAuth = () => {
  const token = localStorage.getItem('token')
  if (!token) throw redirect('/login')

  return null
}

export const logout = () => {
  localStorage.removeItem('token')
  queryClient.clear()
  window.location.href = '/login'
}
