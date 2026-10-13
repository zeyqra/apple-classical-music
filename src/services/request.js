import { logout } from '../services/user'

const BASE_URL = '/api'

export const request = async (path, { payload, method = 'GET', headers = {}, signal }) => {
  const cookie = localStorage.getItem('cookie')
  if (cookie) {
    path += '&cookie=' + cookie
    payload = { ...payload, cookie }
  }

  const response = await fetch(BASE_URL + path, {
    method,
    headers: {
      ...(payload ?? { 'Content-Type': 'application/json;charset=UTF-8' }),
      ...headers,
    },
    ...(payload ?? { body: JSON.stringify(payload) }),
    signal,
  })

  if (!response.ok) {
    if (response.status === 401) {
      logout()
    }

    throw new Error('HTTP ' + response.status)
  }

  if (response.status === 204) return null

  return await response.json()
}

export const get = (path, options) => request(path, options)
export const post = (path, payload, options) =>
  request(path, { ...options, payload, method: 'POST' })
