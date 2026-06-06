import { useMutation, useQuery } from '@tanstack/react-query'
import { login, register, userInfo } from '../api/auth'

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  })
}
export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  })
}

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: userInfo,
    enabled: !!localStorage.getItem('token'),
  })
}
