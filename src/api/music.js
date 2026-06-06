import request from '../utils/request'

export const getTopAlbum = ({ type = '', page = 1, pageSize = 5 }) => {
  return request.get('/top/album', { params: { type, page, pageSize } })
}

export const getAlbum = ({ album_id }) => {
  return request.get('/album', { params: { album_id } })
}

export const getAlbumSongs = ({ id, page, pageSize }) => {
  return request.get('/album/songs', { params: { id, page, pageSize } })
}
