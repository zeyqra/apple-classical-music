// import useMusicStore from './stores/music'

export const msToHms = ms => {
  const totalSeconds = Math.max(0, Math.floor((ms ?? 0) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const paddedSeconds = String(seconds).padStart(2, '0')

  if (hours === 0) return `${minutes}:${paddedSeconds}`
  return `${hours}:${minutes}:${paddedSeconds}`
}

// export const addSongToQueue = (song, delta) => {
//   const queue = useMusicStore.getState().queue
//   const index = useMusicStore.getState().index
//   const setQueue = useMusicStore.getState().setQueue

//   // if (Array.isArray(song))
//   const newQueue = [...queue]
//   let indexToInsert
//   if (delta === 1) {
//     indexToInsert = index + 1
//   } else if (delta === -1) {
//     indexToInsert = queue.length + 1
//   }

//   if (Array.isArray(song)) {
//     newQueue.splice(indexToInsert, 0, ...song)
//   } else {
//     newQueue.splice(indexToInsert, 0, song)
//   }
//   setQueue(newQueue)
// }

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

// [{recordings: {}, tracks: []}]
export const tracksGroupByRecording = tracks => {
  const recordingsGroup = []
  const tracksGroup = []
  for (let i = 0; i < tracks.length; i++) {
    tracksGroup.push(tracks[i])
    if (tracks[i].recording_id !== tracks[i + 1]?.recording_id || i === tracks.length) {
      const { recording_id, composer_id, composer_name, work_id, work_title, performers } =
        tracks[i]
      recordingsGroup.push({
        recording: {
          id: recording_id,
          composer_id,
          composer_name,
          work_id,
          work_title,
          performers,
        },
        tracks: [...tracksGroup],
      })
      tracksGroup.length = 0
    }
  }

  return recordingsGroup
}

// [{ album: {}, recordings: [{ recording: {}, tracks: [] }] }]
export const tracksGroupByAlbum = tracks => {
  const albumsGroup = []
  const tracksGroup = []
  for (let i = 0; i < tracks.length; i++) {
    tracksGroup.push(tracks[i])
    if (tracks[i].album_id !== tracks[i + 1]?.album_id || i === tracks.length) {
      const { album_id, album_title } = tracks[i]
      albumsGroup.push({
        album: {
          id: album_id,
          title: album_title,
        },
        recordings: tracksGroupByRecording([...tracksGroup]),
      })
      tracksGroup.length = 0
    }
  }

  return albumsGroup
}
