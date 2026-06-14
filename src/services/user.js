import { useMutation, useQuery } from '@tanstack/react-query'
import request from './request'
import useUserStore from '../stores/user'
import queryClient from './queryClient'

// api
export const loginCellphone = data => {
  return request.post('/login/cellphone', data)
}

export const captchaSent = ({ phone }) => {
  return request.get(`/captcha/sent?phone=${phone}`)
}

export const loginQrKey = () => {
  return request.get('/login/qr/key', {
    params: {
      timestamp: Date.now(),
    },
  })
}
export const loginQrCreate = data => {
  return request.get('/login/qr/create', {
    params: {
      ...data,
      timestamp: Date.now(),
    },
  })
}
export const loginQrCheck = data => {
  return request.get('/login/qr/check', {
    params: {
      ...data,
      timestamp: Date.now(),
    },
  })
}
const apiLogout = () => {
  return request.get('/logout')
}

const loginStatus = () => {
  return request.get('/login/status')
}
// const userDetail = data => {
//   return request.get('/user/detail', {
//     params: {
//       ...data,
//       uid: 1645212553,
//     },
//   })
// }

// query
export const useLoginStatus = () => {
  const cookie = useUserStore(state => state.cookie)
  return useQuery({
    queryKey: ['loginStatus'],
    queryFn: loginStatus,
    enabled: !!cookie,
  })
}
// export const useUserDetail = () => {
//   const cookie = useUserStore(state => state.cookie)
//   return useQuery({
//     queryKey: ['userDetail'],
//     queryFn: userDetail,
//     enabled: !!cookie,
//   })
// }

export const logout = async () => {
  await apiLogout()
  queryClient.removeQueries('loginStatus')
  useUserStore.getState().setCookie('')
}
