import { useEffect, useRef, useState } from 'react'
import useMusicStore from '../stores/useMusicStore'
import { useSongUrlV1 } from '../hooks/useMusic'
import useAppStore from '../stores/useAppStore'
import { usePlayNextPrev } from '../hooks/useMusic'

const Header = () => {
  const queue = useMusicStore(state => state.queue) // 默认 []
  const index = useMusicStore(state => state.index) // 默认 null

  const song = queue[index] || {}
  const id = song?.id
  const { data: urlData = {} } = useSongUrlV1({ id, level: 'exhigh' })
  const url = urlData.data?.[0]?.url // undefined

  const isPlay = useMusicStore(state => state.isPlay)
  const setIsPlay = useMusicStore(state => state.setIsPlay)
  const [dt, setDt] = useState(null)
  const [ct, setCt] = useState(0)
  const [vol, setVol] = useState(0.5)
  // const [mode, setMode] = useState('list')
  const mode = useMusicStore(state => state.mode)
  const setMode = useMusicStore(state => state.setMode)

  const audioRef = useRef(null)

  const playNextPrev = usePlayNextPrev()
  const sameIndexAndIdButReStart = useMusicStore(state => state.sameIndexAndIdButReStart)

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
      const result = playNextPrev(1)
      if (result === 'boundary') {
        audioRef.current.currentTime = 0
        audioRef.current.pause()
      }
      if (result === 'restart') {
        audioRef.current.currentTime = 0
      }
    }
    audioRef.current.addEventListener('ended', handleEnded)
    return () => {
      audioRef.current.removeEventListener('ended', handleEnded)
    }
  }, [url])

  useEffect(() => {
    if (!url || !audioRef.current) return
    const handlePlayPause = bl => setIsPlay(bl)
    audioRef.current.addEventListener('play', () => handlePlayPause(true))
    audioRef.current.addEventListener('pause', () => handlePlayPause(false))
    return () => {
      audioRef.current.removeEventListener('play', () => handlePlayPause(true))
      audioRef.current.removeEventListener('pause', () => handlePlayPause(false))
    }
  }, [url])

  const handlePlayPauseClick = () => {
    if (audioRef.current.paused) audioRef.current.play()
    else audioRef.current.pause()
  }

  const handlePrevNextClick = delta => {
    const audio = audioRef.current
    const result = playNextPrev(delta)
    if (result === 'boundary') {
      audio.currentTime = 0
      audio.pause()
    }
    if (result === 'restart') {
      audio.currentTime = 0
    }
  }

  const handleVolChange = e => {
    const newVol = e.target.value
    // audioRef.current.volume = newVol
    setVol(newVol)
  }
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = vol
  }, [vol])
  // useEffect(() => {
  //   if (!url || !audioRef.current) return
  //   const handleVc = () => setVol(audioRef.current.volume)
  //   audioRef.current.addEventListener('volumechange', handleVc)
  //   return () => {
  //     audioRef.current.removeEventListener('volumechange', handleVc)
  //   }
  // }, [url])

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

  const [isSeeking, setIsSeeking] = useState(false)
  const [seekCt, setSeekCt] = useState(0)
  const handleSliderChange = e => {
    setSeekCt(Number(e.target.value))
  }

  const handleSeekStart = e => {
    setSeekCt(Number(e.target.value))
    setIsSeeking(true)
  }

  const handleSeekEnd = e => {
    const newCt = Number(e.target.value)
    console.log('console: end', newCt)
    audioRef.current.currentTime = newCt
    setCt(Math.round(newCt))
    setIsSeeking(false)
    lastCtSecond.current = Math.round(newCt)
  }

  const formatTime = seconds => {
    if (seconds == null) return '--:--'
    const m = String(Math.round(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }
  let displayCt = '--:--'
  let displayRestDt = '--:--'
  if (dt !== null) {
    displayCt = formatTime(Math.min(Math.round(ct), Math.round(dt))) // // 存在 元数据duration < 实际可播放长度 的情况，音频文件末尾存在静默 padding
    displayRestDt = formatTime(Math.max(0, Math.round(dt - ct)))
  }
  // const progress = dt ? (ct / dt) * 100 : 0

  const handleModeClick = () => {
    const modes = ['list', 'listLoop', 'singleLoop']
    const currentIndex = modes.indexOf(mode)
    const nextIndex = (currentIndex + 1) % modes.length
    setMode(modes[nextIndex])
  }

  const setIsSbOpen = useAppStore(state => state.setIsSbOpen)
  const setSbType = useAppStore(state => state.setSbType)
  const isSbOpen = useAppStore(state => state.isSbOpen)
  const handleQueueClick = () => {
    setIsSbOpen(!isSbOpen)
    setSbType('queue')
  }
  // const handleCoverClick = () => {}
  // const handleProgressClick = () => {}
  // const handleVolumeProgressClick = () => {}
  // const handlePlaylistClick = () => {}
  // const handleInfoClick = () => {}
  // const handleAvatarClick = () => {}

  return (
    <div className="Header flex items-center justify-between">
      {/* {JSON.stringify(url)} */}
      {/* control buttons */}
      <div className="flex items-center justify-center gap-1 w-[20%]">
        <button onClick={() => handlePrevNextClick(-1)}>Prev</button>
        <button onClick={handlePlayPauseClick}>{isPlay ? 'Pause' : 'Play'}</button>
        <button onClick={() => handlePrevNextClick(1)}>Next</button>
        <button onClick={handleModeClick}>{mode}</button>
      </div>

      {/* song info */}
      <div className="flex items-center gap-1 w-[45%]">
        {/* onClick={handleCoverClick} */}
        <audio className="hidden" ref={audioRef}></audio>
        <img className="w-10 h-10" src={song.alPicUrl} alt="song cover" />
        <div className="text-xs flex-1 flex flex-col items-center justify-between">
          <div className="whitespace-nowrap overflow-hidden text-ellipsis">{song.name}</div>
          <div className="whitespace-nowrap overflow-hidden text-ellipsis">{song.artists}</div>
          <div className="w-full flex items-center justify-between gap-1">
            <span>{displayCt}</span>
            <input
              className="flex-1"
              type="range"
              min="0"
              max={dt ?? 0}
              step="0.1"
              value={isSeeking ? seekCt : ct}
              onChange={handleSliderChange}
              onPointerDown={handleSeekStart}
              onPointerUp={handleSeekEnd}
            />
            <span>{displayRestDt}</span>
          </div>
        </div>
      </div>

      {/* volume control */}
      <div>
        <input
          className="w-24"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={vol}
          onChange={handleVolChange}
        />
      </div>
      {/* lyric */}

      {/* queue */}
      <div onClick={handleQueueClick}>Queue</div>

      {/* info playlist avatar */}
      {/* <div className="flex items-center gap-2">
        <button onClick={handleInfoClick}>info</button>
        <button onClick={handlePlaylistClick}>playlist</button>
        <button onClick={handleAvatarClick}>avatar</button>
      </div> */}
    </div>
  )
}

export default Header
