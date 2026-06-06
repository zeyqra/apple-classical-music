import { create } from 'zustand'

const useMusicStore = create((set, get) => ({
  id: null,
  /**
   * {
   *  id, name, dt, alPicUrl, artists, sort, played
   * }
   */
  queue: [],
  playlist: [],
  isPlay: false,
  index: 0,
  mode: 'list',
  sameIndexAndIdButReStart: 0,
  playAlbum: (queue, index = 0) => {
    const state = get()
    const oldIndex = state.index
    const oldId = state.queue[oldIndex]?.id
    const newId = queue[index]?.id
    // 点击专辑或歌曲播放后，仍有可能 index、id不变
    if (oldId === newId && oldIndex === index) {
      set(state => ({ sameIndexAndIdButReStart: state.sameIndexAndIdButReStart + 1 }))
      return
    }
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
}))

export default useMusicStore
