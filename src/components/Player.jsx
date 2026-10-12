import ProgressBar from './ProgressBar'
import VolBar from './VolBar'
import { usePlayer } from '../context/player'
import Controller from './Controller'
import SongInfo from './SongInfo'
import Cover from './Cover'
import useAppStore from '../stores/app'
import FullPlayer from './FullPlayer'
import { Maximize2 } from 'lucide-react'

const Player = () => {
  const { controller, song, progress, volumn } = usePlayer()

  const showFullPlayer = useAppStore(state => state.showFullPlayer)
  const setShowFullPlayer = useAppStore(state => state.setShowFullPlayer)
  const handleCoverClick = () => {
    console.log('console: click')
    setShowFullPlayer(true)
  }

  return (
    <>
      {/* control buttons */}
      <Controller className="justify-center gap-4 w-[30%]" {...controller} />

      {/* song info */}
      <div className="flex items-center w-[50%] border-r border-l border-zinc-300 group">
        <div className="relative w-12 h-12 border-r border-zinc-300">
          {song.id && (
            <div
              className="hidden group-hover:flex w-full h-full absolute top-0 left-0 group-hover:bg-black/30 items-center justify-center"
              onClick={handleCoverClick}>
              <Maximize2 color="#fff" />
            </div>
          )}
          <Cover song={song} />
        </div>
        <div className={`flex-1 flex justify-between flex-col h-12 text-xs group`}>
          {song.id ? (
            <>
              <SongInfo className="flex flex-col items-center justify-center" song={song} />

              <ProgressBar className="h-[12px]" {...progress} />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">React Music</div>
          )}
        </div>
      </div>

      {/* volume control */}
      <div className="w-[25%] flex items-center justify-center">
        <VolBar className="w-[50%]" {...volumn} />
      </div>

      <FullPlayer />
    </>
  )
}

export default Player
