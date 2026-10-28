import { del, get, post } from './request'

export const albums = params => get('/albums', params)

export const album = params => get(`/albums/${params.id}`)

export const libraryTracks = () => get(`/library/tracks`)

export const libraryTracksAdd = data => post(`/library/tracks`, data)

export const libraryTracksRemove = data => del(`/library/tracks`, data)

export const libraryAlbumTrackIds = params => get(`/library/albumTracks`, params)
