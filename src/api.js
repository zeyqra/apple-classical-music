import { del, get, post } from './request'

export const albums = params => get('/albums', params)

export const album = params => get(`/albums/${params.id}`)

export const libraryTracks = () => get(`/library/tracks`)

export const libraryTracksAdd = params => post(`/library/tracks/${params.id}`)

export const libraryTracksRemove = params => del(`/library/tracks/${params.id}`)
