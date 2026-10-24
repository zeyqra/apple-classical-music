import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import useStore from './store'
import { usePlayNextPrev } from './hooks'

const PlayerContext = createContext()

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null)
  const queue = useStore(state => state.queue) // 默认 []
  const index = useStore(state => state.index) // 默认 null

  const track = queue[index] || null
  const id = track?.id || null
  const url = track?.track_url || null
  // const { data: urlData = {} } = useSongUrlV1({ id, level: 'lossless' })
  // const url = urlData.data?.[0]?.url // undefined
  const isPlay = useStore(state => state.isPlay)
  const setIsPlay = useStore(state => state.setIsPlay)
  const dt = useStore(state => state.dt)
  const setDt = useStore(state => state.setDt)
  const ct = useStore(state => state.ct)
  const setCt = useStore(state => state.setCt)
  const vol = useStore(state => state.vol)
  const setVol = useStore(state => state.setVol)
  const mode = useStore(state => state.mode)
  const setMode = useStore(state => state.setMode)
  const isSeeking = useStore(state => state.isSeeking)
  const setIsSeeking = useStore(state => state.setIsSeeking)
  const seekCt = useStore(state => state.seekCt)
  const setSeekCt = useStore(state => state.setSeekCt)
  const sameIndexAndIdButReStart = useStore(state => state.sameIndexAndIdButReStart)

  const playNextPrev = usePlayNextPrev()

  const play = useCallback(() => {
    audioRef.current?.play()
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  // const seek = useCallback(time => {
  //   if (audioRef.current) {
  //     audioRef.current.currentTime = time
  //   }
  // }, [])

  const controller = {
    track,
    isPlay: isPlay,
    mode: mode,
    handlePlayPauseClick: () => {
      if (audioRef.current.paused) audioRef.current.play()
      else audioRef.current.pause()
    },
    handlePrevNextClick: delta => {
      const audio = audioRef.current
      const result = playNextPrev(delta)
      console.log('console: handlePrevNextClick result', result)
      if (result === 'boundary') {
        audio.currentTime = 0
        audio.pause()
      }
      if (result === 'restart') {
        audio.currentTime = 0
        if (audioRef.current.paused) audioRef.current.play()
      }
    },
    handleModeClick: () => {
      const modes = ['listLoop', 'singleLoop', 'list']
      const currentIndex = modes.indexOf(mode)
      const nextIndex = (currentIndex + 1) % modes.length
      console.log('console: setMode', modes[nextIndex])
      setMode(modes[nextIndex])
    },
  }

  const formatTime = seconds => {
    if (seconds == null) return '--:--'
    const m = String(Math.round(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }
  // const [displayCt, setDisplayCt] = useState('--:--')
  let displayCt = '--:--'
  // const [displayRestDt, setDisplayRestDt] = useState('--:--')
  let displayRestDt = '--:--'
  if (dt !== null) {
    displayCt = formatTime(Math.min(Math.round(ct), Math.round(dt))) // // 存在 元数据duration < 实际可播放长度 的情况，音频文件末尾存在静默 padding
    displayRestDt = formatTime(Math.max(0, Math.round(dt - ct)))
    // setDisplayCt(formatTime(Math.min(Math.round(ct), Math.round(dt))))
    // setDisplayRestDt(formatTime(Math.max(0, Math.round(dt - ct))))
  }
  const progress = {
    value: isSeeking ? seekCt : ct,
    max: dt,
    displayCt,
    displayRestDt,
    onChange(e) {
      setSeekCt(Number(e.target.value))
    },

    onPointerDown(e) {
      setIsSeeking(true)
      setSeekCt(Number(e.target.value))
    },

    onPointerUp(e) {
      const value = Number(e.target.value)

      audioRef.current.currentTime = value

      lastCtSecond.current = Math.round(value)

      setCt(Math.round(value))
      setSeekCt(value)
      setIsSeeking(false)
    },
  }

  const volumn = {
    value: vol,
    onChange(e) {
      const newVol = e.target.value
      // audioRef.current.volume = newVol
      setVol(newVol)
    },
  }

  useEffect(() => {
    if (!url || !audioRef.current) return
    audioRef.current.currentTime = 0
    audioRef.current.play()
  }, [sameIndexAndIdButReStart])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    setCt(0)
  }, [index])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.removeAttribute('src')
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setCt(0)
    setDt(null)
  }, [id])

  useEffect(() => {
    if (!url || !audioRef.current) return
    audioRef.current.src = url
    audioRef.current.play()
  }, [url])

  useEffect(() => {
    if (!url || !audioRef.current) return
    const handleEnded = () => {
      console.log('console: ended mode', mode)
      const result = playNextPrev(1)
      console.log('console: ended result', mode, result)
      if (result === 'boundary') {
        audioRef.current.currentTime = 0
        audioRef.current.pause()
      }
      if (result === 'restart') {
        audioRef.current.currentTime = 0
        // debugger
        console.log('console: restart', audioRef.current.paused)
        audioRef.current.play()
      }
    }
    audioRef.current.addEventListener('ended', handleEnded)
    return () => {
      audioRef.current.removeEventListener('ended', handleEnded)
    }
  }, [url, mode, playNextPrev])

  useEffect(() => {
    if (!url || !audioRef.current) return
    const onPlay = () => setIsPlay(true)
    const onPause = () => setIsPlay(false)
    audioRef.current.addEventListener('play', onPlay)
    audioRef.current.addEventListener('pause', onPause)
    return () => {
      audioRef.current.removeEventListener('play', onPlay)
      audioRef.current.removeEventListener('pause', onPause)
    }
  }, [url])

  useEffect(() => {
    if (!audioRef.current) return
    console.log('console: effect vol ', vol * 0.5)
    audioRef.current.volume = vol * 0.5
  }, [vol])
  useEffect(() => {
    if (!url || !audioRef.current) return
    const handleLmd = () => {
      setDt(audioRef.current.duration)
      console.log('console: dt', audioRef.current.duration)
    }
    audioRef.current.addEventListener('loadedmetadata', handleLmd)
    return () => {
      audioRef.current.removeEventListener('loadedmetadata', handleLmd)
    }
  }, [url])

  const lastCtSecond = useRef(0) // 暂停/1.1 1.2 => setState(1)
  useEffect(() => {
    if (!url || !audioRef.current) return
    const handleTu = () => {
      // console.log('console: tu', audioRef.current.currentTime)
      const currentSecond = Math.round(audioRef.current.currentTime)
      if (currentSecond !== lastCtSecond.current) {
        lastCtSecond.current = currentSecond
        setCt(currentSecond)
      }
    }
    audioRef.current.addEventListener('timeupdate', handleTu)
    return () => {
      audioRef.current.removeEventListener('timeupdate', handleTu)
    }
  }, [url])
  return (
    <PlayerContext.Provider
      value={{
        track,
        play,
        pause,
        controller,
        progress,
        volumn,
      }}>
      {children}
      <audio ref={audioRef} />
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)
