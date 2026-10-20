import { logout } from '../services/user'

const BASE_URL = '/api'

export const request = async (path, { payload, method = 'GET', headers = {}, signal }) => {
  const url = new URL(BASE_URL + path, window.location.origin)
  // const cookie = localStorage.getItem('cookie')
  // if (cookie) {
  //   url.searchParams.append('cookie', cookie)
  //   payload = { ...payload, cookie }
  // }
  // console.log('console: ', url)

  const response = await fetch(url, {
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
