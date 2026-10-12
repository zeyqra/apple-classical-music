import { CircleMinus } from 'lucide-react'
import useMusicStore from '../stores/music'
import ImgLazy from './ImgLazy'

const Queue = () => {
  const queue = useMusicStore(state => state.queue) // 默认 []
  const setQueue = useMusicStore(state => state.setQueue)
  const index = useMusicStore(state => state.index) // 默认 0

  const handleRemove = remveIndex => {
    setQueue(queue.filter((_, i) => i !== remveIndex))
  }
  return (
    <div className="h-full flex flex-col">
      <h2 className="font-bold sticky top-0 bg-white p-1 shrink-0">Queue</h2>
      <div className="h-full space-y-0.5 p-1 overflow-y-auto flex-1">
        {queue.slice(index + 1).map((song, restIndex) => (
          <div
            key={song.id + ' ' + restIndex}
            className="relative group text-sm flex items-center gap-1 w-full">
            <ImgLazy className="w-8 h-8" src={`${song.alPicUrl}?param=180y180`} alt="song cover" />
            <div className="flex-1 overflow-hidden">
              <div className="whitespace-nowrap overflow-hidden text-ellipsis">{song.name}</div>
              <div className="whitespace-nowrap overflow-hidden text-ellipsis">{song.artists}</div>
            </div>
            <button
              className="hidden group-hover:block rounded-full absolute -top-0.5 -left-0.5"
              onClick={() => handleRemove(restIndex + (index + 1))}>
              <CircleMinus color="white" fill="red" size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Queue
