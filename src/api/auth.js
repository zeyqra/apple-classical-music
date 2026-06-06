import request from '../utils/request'

export const login = data => {
  return request.post('/login', data)
}

export const register = data => {
  return request.post('/register', data)
}

export const userInfo = data => {
  return request.get('/user-info', data)
}
