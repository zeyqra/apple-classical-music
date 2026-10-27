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
  trackIds: new Set(),
  fetchTrackIds: async () => {
    const tracks = await libraryTracks()
    set({ trackIds: new Set(tracks.map(tk => tk.id)) })
  },
  addTracksToLibrary: async ({ trackIds, albumId }) => {
    await libraryTracksAdd({ trackIds, albumId })
    set(state => ({ trackIds: new Set(...state.trackIds, ...trackIds) }))
  },
  removeTracksFromLibrary: async ({ trackIds, albumId }) => {
    await libraryTracksRemove({ trackIds, albumId })
    set(state => {
      const trackIds = new Set(state.trackIds)
      trackIds.forEach(id => trackIds.delete(id))
      return { trackIds }
    })
  },
}))

export default useStore
