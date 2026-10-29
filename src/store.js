import { create } from 'zustand'
import { libraryTracks, libraryTracksAdd, libraryTracksRemove } from './api'

const useStore = create((set, get) => ({
  // 播放器
  id: null,
  queue: [],
  playlist: [],
  isPlay: false,
  index: 0,
  mode: 'listLoop',
  sameIndexAndIdButReStart: 0,
  play: (queue, index = 0) => {
    // const state = get()
    // 点击专辑或歌曲播放后，仍有可能 index、id不变
    // const oldIndex = state.index
    // const oldId = state.queue[oldIndex]?.id
    // const newId = queue[index]?.id
    // if (oldId === newId && oldIndex === index) {
    //   set(state => ({ sameIndexAndIdButReStart: state.sameIndexAndIdButReStart + 1 }))
    //   return
    // }
    set(() => ({
      queue,
      index,
    }))
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

  // 资料库
  libraryTrackIds: new Map(),
  setLibraryTracks: async () => {
    const tracks = await libraryTracks()
    const libraryTrackIds = new Map()
    tracks.forEach(tk => {
      if (!libraryTrackIds.has(tk.album_id)) {
        libraryTrackIds.set(tk.album_id, new Set())
      }
      libraryTrackIds.get(tk.album_id).add(tk.id)
    })
    set({ libraryTrackIds })
  },
  addTracksToLibrary: async data => {
    const { trackIds, albumId } = await libraryTracksAdd(data)

    set(state => {
      const libraryTrackIds = new Map(state.libraryTrackIds)
      const libTkIdsAl = new Set(state.libraryTrackIds.get(albumId) || [])

      trackIds.forEach(tkId => libTkIdsAl.add(tkId))
      libraryTrackIds.set(albumId, libTkIdsAl)

      return { libraryTrackIds }
    })
  },
  removeTracksFromLibrary: async data => {
    const { trackIds, albumId } = await libraryTracksRemove(data)
    set(state => {
      const libraryTrackIds = new Map(state.libraryTrackIds)
      const libTkIdsAl = new Set(state.libraryTrackIds.get(albumId))

      trackIds.forEach(tkId => libTkIdsAl.delete(tkId))

      if (libTkIdsAl.size === 0) {
        libraryTrackIds.delete(albumId)
      } else {
        libraryTrackIds.set(albumId, libTkIdsAl)
      }

      return { libraryTrackIds }
    })
  },
}))

export default useStore
