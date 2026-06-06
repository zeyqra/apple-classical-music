import useMusicStore from '../stores/useMusicStore'

export const msToHms = ms => {
  const totalSeconds = Math.max(0, Math.floor((ms ?? 0) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const paddedSeconds = String(seconds).padStart(2, '0')

  if (hours === 0) return `${minutes}:${paddedSeconds}`
  return `${hours}:${minutes}:${paddedSeconds}`
}

// 初次播放 id 为空
// export function play(delta, { id, mode, queue, setId }) {
//   const newId = getPrevNextPlayIdByMode(delta, { id, mode, queue })
//   if (newId !== id) {
//     setId(newId)
//     // setqueue song（id） out，newid playing（id in，newid playing）
//     return
//   }
//   if (mode === 'singleLoop') {
//     audioRef.current.currentTime = 0
//   }
//   if (mode === 'list') {
//     audioRef.current.currentTime = 0
//     audioRef.current.pause()
//   }
// }

function getPrevNextPlayIdByMode(delta, { id, mode, queue }) {
  if (mode === 'singleLoop') return id
  if (mode === 'list') {
    const currentIndex = queue.findIndex(song => song.id === id)
    const total = queue.length
    const crossoverIndex = delta === 1 ? total - 1 : 0
    const newIndex = currentIndex === crossoverIndex ? crossoverIndex : currentIndex + delta
    return queue[newIndex]?.id
  }
  if (mode === 'listLoop') {
    const currentIndex = queue.findIndex(song => song.id === id)
    const total = queue.length
    const newIndex = (currentIndex + delta + total) % total
    return queue[newIndex]?.id
    // newid取第一首（最后一首），queue 所有song in（out），第一首（最后一首）playing
  }
}

// 初次播放 id 为空
// export function play1(delta, { id, mode, queue, setId }) {
//   const newId = getPrevNextPlayIdByMode(delta, { id, mode, queue })
//   if (newId !== id) {
//     setId(newId)
//     // setqueue song（id） out，newid playing（id in，newid playing）
//     return
//   }
//   if (mode === 'singleLoop') {
//     audioRef.current.currentTime = 0
//   }
//   if (mode === 'list') {
//     audioRef.current.currentTime = 0
//     audioRef.current.pause()
//   }
// }

export function usePlay(delta, { id, mode, queue }, audioRef) {
  const setId = useMusicStore(state => state.setId)
  const setQueue = useMusicStore(state => state.setQueue)
  // 先走index边界逻辑
  const currentIndex = queue.findIndex(song => song.status === 'playing')
  const total = queue.length
  const crossoverIndex = delta === 1 ? total - 1 : 0
  if (crossoverIndex === currentIndex && (mode === 'list' || mode === 'listLoop')) {
    // list：newid不变，queue不变，设置ct pause
    if (mode === 'list') {
      audioRef.current.currentTime = 0
      audioRef.current.pause()
    }
    // listloop：newid取第一首（最后一首），queue 所有song toPlay（outPlay），第一首（最后一首）playing
    // status属性：toPlay待播；outPlay非待播；playing在播放
    if (mode === 'listLoop') {
      const newIndex = (currentIndex + delta + total) % total // 0 或 total - 1
      const newId = queue[newIndex]?.id
      setQueue(
        queue.map((song, index) => {
          if (index === newIndex) return { ...song, status: 'playing' }
          return { ...song, status: delta === 1 ? 'toPlay' : 'outPlay' } // toPlay待播；outPlay非待播
        })
      )
      if (newId !== id) {
        setId(newId)
      } else {
        audioRef.current.currentTime = 0
      }
    }
    return
  }
  // 再走index一般逻辑
  //   依次按mode逻辑
  //   一般逻辑：
  //   single：只需要设置播放器的ct
  if (mode === 'singleLoop') audioRef.current.currentTime = 0
  //   list（loop） ：setid queue的下（上）一个newid，setqueue song outPlay，newid playing（id toPlay，newid playing）
  if (mode === 'list' || mode === 'listLoop') {
    setQueue(
      queue.map((song, index) => {
        if (index === currentIndex) return { ...song, status: delta === 1 ? 'outPlay' : 'toPlay' }
        if (index === currentIndex + delta) return { ...song, status: 'playing' }
        return song
      })
    )
    const newId = queue[currentIndex + delta]?.id
    if (newId !== id) {
      setId(newId)
    } else {
      audioRef.current.currentTime = 0
    }
  }
}
