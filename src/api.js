import { del, get, post } from './request'

export const albums = params => get('/albums', params)

export const album = params => get(`/albums/${params.id}`)

export const libraryTracks = () => get(`/library/tracks`)

export const libraryTracksAdd = data => post(`/library/tracks`, data)

export const libraryTracksRemove = data => del(`/library/tracks`, data)

// export const libraryAlbumTrackIds = params => get(`/library/albumTracks`, params)

// 创建播放列表
export const createPlaylist = data => post('/playlist/create', data)
// 删除播放列表
export const removePlaylist = data => del('/playlist/create', data)
// 获取用户创建的播放列表
export const playlistCreated = () => get('/playlist/create')
// 获取官方播放列表
export const playlistOffical = () => get('/playlist/offical')
// 将曲目添加到播放列表
export const addTrackToPlaylist = data => post('/playlist/tracks', data)
// 将曲目从播放列表移除
export const removeTrackFromPlaylist = data => del('/playlist/tracks', data)
// 获取播放列表详情
export const playlist = params => get(`/playlist/${params.id}`)
// 收藏播放列表
export const collectPlaylist = () => post('/playlist/collect')
// 获取用户收藏的播放列表
export const playlistCollected = () => get('/playlist/collect')
