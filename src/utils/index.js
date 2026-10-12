import useMusicStore from '../stores/music'

export const msToHms = ms => {
  const totalSeconds = Math.max(0, Math.floor((ms ?? 0) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const paddedSeconds = String(seconds).padStart(2, '0')

  if (hours === 0) return `${minutes}:${paddedSeconds}`
  return `${hours}:${minutes}:${paddedSeconds}`
}

export const addSongToQueue = (song, delta) => {
  const queue = useMusicStore.getState().queue
  const index = useMusicStore.getState().index
  const setQueue = useMusicStore.getState().setQueue

  // if (Array.isArray(song))
  const newQueue = [...queue]
  let indexToInsert
  if (delta === 1) {
    indexToInsert = index + 1
  } else if (delta === -1) {
    indexToInsert = queue.length + 1
  }

  if (Array.isArray(song)) {
    newQueue.splice(indexToInsert, 0, ...song)
  } else {
    newQueue.splice(indexToInsert, 0, song)
  }
  setQueue(newQueue)
}

export const parseLyric = lyric =>
  lyric.split('\n').map(line => {
    const match = line.match(/^\[(\d+):(\d+)[.:](\d+).*\](.*)$/)

    if (!match)
      return {
        time: null,
        text: line,
      }

    const [, min, sec, ms, text] = match

    return {
      time: Number(min) * 60 + Number(sec) + Number(ms) / 1000,
      text,
    }
  })
// .filter(item => item && item.text)
