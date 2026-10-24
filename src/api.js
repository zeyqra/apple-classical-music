import { request } from './request'

export const albums = (params, options) => {
  return request('/albums', {
    params,
    ...options,
  })
}

export const album = (params, options) => {
  return request(`/albums/${params.id}`, {
    params,
    ...options,
  })
}

export const libraryTracksList = (params, options) => {
  return request(`/library/tracks/list`, {
    params,
    ...options,
  })
}
export const libraryTracksAdd = (params, options) => {
  return request(`/library/tracks/add/${params.id}`, {
    params,
    method: 'POST',
    ...options,
  })
}
export const libraryTracksRemove = (params, options) => {
  return request(`/library/tracks/remove/${params.id}`, {
    params,
    method: 'POST',
    ...options,
  })
}
