const BASE_URL = '/api'

export const request = async (path, { payload, method = 'GET', headers = {}, signal }) => {
  const url = new URL(BASE_URL + path, window.location.origin)
  // const cookie = localStorage.getItem('cookie')
  // if (cookie) {
  //   url.searchParams.append('cookie', cookie)
  //   payload = { ...payload, cookie }
  // }
  // console.log('console: ', url)

  if (payload && method === 'GET') {
    Object.entries(payload).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  const response = await fetch(url, {
    method,
    headers: {
      ...(payload && method !== 'GET' ? { 'Content-Type': 'application/json;charset=UTF-8' } : {}),
      ...headers,
    },
    ...(payload && method !== 'GET' ? { body: JSON.stringify(payload) } : {}),
    signal,
  })

  if (!response.ok) {
    if (response.status === 401) {
    }

    throw new Error('HTTP ' + response.status)
  }

  if (response.status === 204) return null

  return await response.json()
}

export const get = (path, payload, options) => request(path, { method: 'GET', payload, ...options })
export const post = (path, payload, options) =>
  request(path, { method: 'POST', payload, ...options })
export const put = (path, payload, options) => request(path, { method: 'PUT', payload, ...options })
export const del = (path, payload, options) =>
  request(path, { method: 'DELETE', payload, ...options })
