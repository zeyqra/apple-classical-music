import { create } from 'zustand'
import api from './api'

const useStore = create((set, get) => ({
  // 播放器
  id: null,
  queue: [],
  isPlay: false,
  index: 0,
  mode: 'listLoop',
  sameIndexAndIdButReStart: 0,
  setQueuePlay: ({ queue, index = 0 }) => {
    const state = get()
    // 点击专辑或歌曲播放后，仍有可能 index、id不变
    const oldIndex = state.index
    const oldId = state.queue[oldIndex]?.id
    const newId = queue[index]?.id
    if (oldId === newId && oldIndex === index) {
      set(state => ({ sameIndexAndIdButReStart: state.sameIndexAndIdButReStart + 1 }))
      return
    }
    set(() => ({ queue, index, isPlay: true }))
  },
  moveQueue: delta => {
    const state = get()
    const { queue, mode, index, setIndex } = state

    if (!queue.length) return 'empty'

    const total = queue.length
    const newIndex = index + delta

    // 单曲循环：index 不变
    if (mode === 'singleLoop') {
      return 'restart'
    }

    // 顺序播放
    if (mode === 'list') {
      if (newIndex < 0 || newIndex >= total) {
        return 'boundary' // 播放器 effect 会处理 audio.pause()
      }
      setIndex(newIndex)
      return 'moved'
    }

    // 列表循环
    if (mode === 'listLoop') {
      if (total === 1) return 'restart'

      const nextIndex = (newIndex + total) % total
      setIndex(nextIndex)
      return 'moved'
    }
  },
  setIndex: index => set(() => ({ index })),
  setQueue: queue => set(() => ({ queue })),
  setPlaylist: playlist => set(() => ({ playlist })),
  setIsPlay: isPlay => set(() => ({ isPlay })),
  setMode: mode => set(() => ({ mode })),
  ct: 0,
  setCt: ct => set(() => ({ ct })),
  dt: null,
  setDt: dt => set(() => ({ dt })),
  vol: 0.5,
  setVol: vol => set(() => ({ vol })),
  isSeeking: false,
  setIsSeeking: isSeeking => set(() => ({ isSeeking })),
  seekCt: 0,
  setSeekCt: seekCt => set(() => ({ seekCt })),

  // 侧边栏
  isSbOpen: false,
  setIsSbOpen: isSbOpen => set({ isSbOpen }),
  sbType: 'queue',
  setSbType: sbType => set({ sbType }),
  searchKeywords: '',
  setSearchKeywords: searchKeywords => set({ searchKeywords }),
  showFullPlayer: false,
  setShowFullPlayer: showFullPlayer => set({ showFullPlayer }),

  // 资料库/收藏
  libraryTrackIds: new Set(),
  libraryAlbumIds: new Set(),
  favouriteTrackIds: new Set(),
  favouriteAlbumIds: new Set(),
  favouritePlaylistIds: new Set(),
  favouriteRecordingIds: new Set(),

  setRelations: async () => {
    const {
      libraryTrackIds,
      favouriteTrackIds,
      favouriteAlbumIds,
      favouritePlaylistIds,
      favouriteRecordingIds,
    } = await api.relations()

    set({
      libraryTrackIds: new Set(libraryTrackIds.map(lti => lti.id)),
      libraryAlbumIds: new Set(libraryTrackIds.map(lti => lti.album_id)),
      favouriteTrackIds: new Set(favouriteTrackIds),
      favouriteAlbumIds: new Set(favouriteAlbumIds),
      favouritePlaylistIds: new Set(favouritePlaylistIds),
      favouriteRecordingIds: new Set(favouriteRecordingIds),
    })
  },

  addAlbumToLibrary: async data => {
    const libraryTrackIds = await api.addAlbumToLibrary(data)

    set({
      libraryTrackIds: new Set(libraryTrackIds.map(lti => lti.id)),
      libraryAlbumIds: new Set(libraryTrackIds.map(lti => lti.album_id)),
    })
  },

  removeAlbumFromLibrary: async data => {
    const libraryTrackIds = await api.removeAlbumFromLibrary(data)

    set({
      libraryTrackIds: new Set(libraryTrackIds.map(lti => lti.id)),
      libraryAlbumIds: new Set(libraryTrackIds.map(lti => lti.album_id)),
    })
  },

  addTrackToLibrary: async data => {
    const libraryTrackIds = await api.addTrackToLibrary(data)

    set({
      libraryTrackIds: new Set(libraryTrackIds.map(lti => lti.id)),
      libraryAlbumIds: new Set(libraryTrackIds.map(lti => lti.album_id)),
    })
  },

  removeTrackFromLibrary: async data => {
    const libraryTrackIds = await api.removeTrackFromLibrary(data)

    set({
      libraryTrackIds: new Set(libraryTrackIds.map(lti => lti.id)),
      libraryAlbumIds: new Set(libraryTrackIds.map(lti => lti.album_id)),
    })
  },

  favouriteAlbum: async data => {
    const favouriteAlbumIds = await api.favouriteAlbum(data)

    set({ favouriteAlbumIds: new Set(favouriteAlbumIds) })
  },

  unfavouriteAlbum: async data => {
    const favouriteAlbumIds = await api.unfavouriteAlbum(data)

    set({ favouriteAlbumIds: new Set(favouriteAlbumIds) })
  },

  favouritePlaylist: async data => {
    const favouritePlaylistIds = await api.favouritePlaylist(data)

    set({ favouritePlaylistIds: new Set(favouritePlaylistIds) })
  },

  unfavouritePlaylist: async data => {
    const favouritePlaylistIds = await api.unfavouritePlaylist(data)

    set({ favouritePlaylistIds: new Set(favouritePlaylistIds) })
  },

  favouriteTrack: async data => {
    const favouriteTrackIds = await api.favouriteTrack(data)

    set({ favouriteTrackIds: new Set(favouriteTrackIds) })
  },

  unfavouriteTrack: async data => {
    const favouriteTrackIds = await api.unfavouriteTrack(data)

    set({ favouriteTrackIds: new Set(favouriteTrackIds) })
  },

  favouriteRecording: async data => {
    const favouriteRecordingIds = await api.favouriteRecording(data)

    set({ favouriteRecordingIds: new Set(favouriteRecordingIds) })
  },

  unfavouriteRecording: async data => {
    const favouriteRecordingIds = await api.unfavouriteRecording(data)

    set({ favouriteRecordingIds: new Set(favouriteRecordingIds) })
  },

  createdPlaylists: [],

  setCreatedPlaylist: async () => {
    const createdPlaylists = await api.createdPlaylists()
    set({ createdPlaylists })
  },

  createPlaylist: async data => {
    const createdPlaylists = await api.createPlaylist(data)
    set({ createdPlaylists })
  },
}))

export default useStore
