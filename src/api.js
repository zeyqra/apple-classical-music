import { del, get, post, put } from './request'
export default {
  // albums: params => get('/albums', params),

  // //  album: params => get(`/albums/${params.id}`)

  // libraryTracks: () => get(`/library/tracks`),

  // libraryTracksAdd: data => post(`/library/tracks`, data),

  // libraryTracksRemove: data => del(`/library/tracks`, data),

  // //  libraryAlbumTrackIds: params => get(`/library/albumTracks`, params)

  // // 创建播放列表
  // //  createPlaylist: data => post('/playlist/create', data)
  // // 删除播放列表
  // removePlaylist: data => del('/playlist/create', data),
  // // 获取用户创建的播放列表
  // playlistCreated: () => get('/playlist/create'),
  // // 获取官方播放列表
  // playlistOffical: () => get('/playlist/offical'),
  // // 将曲目添加到播放列表
  // // addTrackToPlaylist: data => post('/playlist/tracks', data),
  // // 将曲目从播放列表移除
  // removeTrackFromPlaylist: data => del('/playlist/tracks', data),
  // // 获取播放列表详情
  // // playlist: params => get(`/playlist/${params.id}`),
  // // 收藏播放列表
  // collectPlaylist: () => post('/playlist/collect'),
  // // 获取用户收藏的播放列表
  // playlistCollected: () => get('/playlist/collect'),

  // =====================
  // 混合列表
  mixlist: () => get('/mixlist'),
  // 专辑详情
  album: params => get(`/album/${params.id}`),
  // 歌单详情
  playlist: params => get(`/playlist/${params.id}`),
  // 所有状态数据
  relations: () => get(`/relations`),
  // 专辑加入资料库
  addAlbumToLibrary: data => put('/library/album', data),
  removeAlbumFromLibrary: data => del('/library/album', data),
  // 曲目加入资料库
  addTrackToLibrary: data => put('/library/track', data),
  removeTrackFromLibrary: data => del('/library/track', data),
  // 创建歌单
  createPlaylist: data => post('/playlist/create', data),
  // 创建的所有歌单
  createdPlaylists: () => get('/playlist/create'),
  // 专辑加入歌单
  addAlbumToPlaylist: data => put('/playlist/album', data),
  // 歌单加入歌单
  addPlaylistToPlaylist: data => put('/playlist/playlist', data),
  // 曲目加入歌单
  addTrackToPlaylist: data => put('/playlist/track', data),
  // 收藏专辑
  favouriteAlbum: data => put('/favourite/album', data),
  unfavouriteAlbum: data => del('/favourite/album', data),
  // 收藏歌单
  favouritePlaylist: data => put('/favourite/playlist', data),
  unfavouritePlaylist: data => del('/favourite/playlist', data),
  // 收藏曲目
  favouriteTrack: data => put('/favourite/track', data),
  unfavouriteTrack: data => del('/favourite/track', data),
  // 收藏录音
  favouriteRecording: data => put('/favourite/recording', data),
  unfavouriteRecording: data => del('/favourite/recording', data),
  // 资料库曲目
  libraryTracks: () => get('/library/tracks'),
  // 收藏专辑列表
  favouriteAlbums: () => get('/favourite/albums'),
  // 收藏歌单列表
  favouritePlaylists: () => get('/favourite/playlists'),
}
