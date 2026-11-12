import { del, get, post, put } from './request'
export default {
  albums: params => get('/albums', params),

  //  album: params => get(`/albums/${params.id}`)

  libraryTracks: () => get(`/library/tracks`),

  libraryTracksAdd: data => post(`/library/tracks`, data),

  libraryTracksRemove: data => del(`/library/tracks`, data),

  //  libraryAlbumTrackIds: params => get(`/library/albumTracks`, params)

  // 创建播放列表
  //  createPlaylist: data => post('/playlist/create', data)
  // 删除播放列表
  removePlaylist: data => del('/playlist/create', data),
  // 获取用户创建的播放列表
  playlistCreated: () => get('/playlist/create'),
  // 获取官方播放列表
  playlistOffical: () => get('/playlist/offical'),
  // 将曲目添加到播放列表
  // addTrackToPlaylist: data => post('/playlist/tracks', data),
  // 将曲目从播放列表移除
  removeTrackFromPlaylist: data => del('/playlist/tracks', data),
  // 获取播放列表详情
  // playlist: params => get(`/playlist/${params.id}`),
  // 收藏播放列表
  collectPlaylist: () => post('/playlist/collect'),
  // 获取用户收藏的播放列表
  playlistCollected: () => get('/playlist/collect'),

  // =====================
  mixlist: () => get('/mixlist'),
  album: params => get(`/album/${params.id}`),
  playlist: params => get(`/playlist/${params.id}`),
  addAlbumToLibrary: data => put('/library/album', data),
  removeAlbumFromLibrary: data => del('/library/album', data),
  createPlaylist: () => post('/playlist/create'),
  createdPlaylists: () => get('/playlist/create'),
  addAlbumToPlaylist: data => put('/playlist/album', data),
  addPlaylistToPlaylist: data => put('/playlist/playlist', data),
  favouriteAlbum: data => put('/favourite/album', data),
  unfavouriteAlbum: data => del('/favourite/album', data),
  favouritePlaylist: data => put('/favourite/playlist', data),
  unfavouritePlaylist: data => del('/favourite/playlist', data),
}
