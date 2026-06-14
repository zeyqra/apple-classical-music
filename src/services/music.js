import { useQuery } from '@tanstack/react-query'
import request from './request'
export const getAlbumNew = ({ area = 'ALL', offset = 0, limit = 10 }) => {
  return request.get('/album/new', { params: { area, offset, limit } })
}
export const getAlbum = ({ id }) => {
  return request.get('/album', { params: { id } })
}
export const getSongUrlV1 = ({ id, level }) => {
  return request.get('/song/url/v1', { params: { id, level } })
}

// ===========================================

export const useAlbumNew = params =>
  useQuery({
    queryKey: ['albumNew', params],
    queryFn: () => getAlbumNew(params),
  })
export const useAlbum = params =>
  useQuery({
    queryKey: ['album', params],
    queryFn: () => getAlbum(params),
  })
export const useSongUrlV1 = params =>
  useQuery({
    queryKey: ['songUrlV1', params],
    queryFn: () => getSongUrlV1(params),
    enabled: !!params.id,
  })
