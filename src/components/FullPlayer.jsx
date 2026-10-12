import ProgressBar from './ProgressBar'
import VolBar from './VolBar'
import { usePlayer } from '../context/player'
import Controller from './Controller'
import SongInfo from './SongInfo'
import { createPortal } from 'react-dom'
import Cover from './Cover'
import useAppStore from '../stores/app'
import Lyric from './Lyric'
import { useEffect, useState } from 'react'
import { MessageSquareQuote, X } from 'lucide-react'

const Player = () => {
  const { controller, song, progress, volumn } = usePlayer()
  const showFullPlayer = useAppStore(state => state.showFullPlayer)
  const setShowFullPlayer = useAppStore(state => state.setShowFullPlayer)

  const [showLyric, setShowLyric] = useState(false)

  useEffect(() => {
    const handlePopState = () => {
      setShowFullPlayer(false)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [setShowFullPlayer])

  return showFullPlayer
    ? createPortal(
        <div className="fixed inset-0 flex gap-2 items-center justify-center bg-white z-50">
          <button className="absolute top-2 left-2" onClick={() => setShowFullPlayer(false)}>
            <X />
          </button>
          <button className="absolute bottom-2 right-2" onClick={() => setShowLyric(prev => !prev)}>
            <MessageSquareQuote />
          </button>
          {/* Player */}
          <div className="flex flex-col items-center gap-2 w-[30%]">
            <Cover song={song} />
            <SongInfo className="text-left w-full text-lg" song={song} isFullPlayer={true} />

            <ProgressBar isFullPlayer={true} {...progress} />
            <Controller
              className="justify-center gap-4 w-full mb-3 -mt-1"
              isFullPlayer={true}
              {...controller}
            />

            <VolBar className="w-full" {...volumn} />
          </div>
          {/* Lyric */}
          {showLyric && <Lyric className="w-[50%] text-2xl" />}
        </div>,
        document.body
      )
    : null
}

export default Player
