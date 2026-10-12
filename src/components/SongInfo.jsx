import { Star, Ellipsis } from 'lucide-react'
import { useLike, useLikeList } from '../services/music'
import Dropdown from '../libs/Dropdown'
import { addSongToQueue } from '../utils'
import { useNavigate } from 'react-router-dom'

const SongInfo = ({ song, className, isFullPlayer }) => {
  const { name, artists } = song

  const { data: listList = new Set() } = useLikeList()
  const { mutate: like } = useLike()
  const handleLikeClick = id => {
    like({ id, like: !listList.has(id), playlistId: id })
  }

  const handlePlayNextLast = delta => {
    const songToPlay = {
      id: song.id,
      name: song.name,
      dt: song.dt,
      alPicUrl: (song.al || song.album).picUrl,
      artists: song.ar.map(artist => artist.name).join('/'),
    }
    addSongToQueue(songToPlay, delta)
  }
  const navigate = useNavigate()
  return (
    <div className={`relative w-full pt-1 ${className || ''}`}>
      <div className="">
        <div className="relative font-bold whitespace-nowrap text-ellipsis ">
          <div className="font-bold">{name}</div>
          <div
            className={`absolute ${isFullPlayer ? 'top-3.5 right-8' : 'top-0.5 -right-3'} shrink-0 flex items-center justify-center`}
            onClick={() => handleLikeClick(song.id)}>
            {listList.has(song.id) ? (
              <Star size={isFullPlayer ? 18 : 8} fill="currentColor" />
            ) : (
              <Star
                className={isFullPlayer ? '' : 'opacity-0 group-hover:opacity-100'}
                size={isFullPlayer ? 18 : 8}
              />
            )}
          </div>
        </div>
      </div>
      <div className=" whitespace-nowrap overflow-hidden text-ellipsis">{artists}</div>

      <div className={`absolute ${isFullPlayer ? 'top-4 right-1' : 'top-1 right-1'}`}>
        <Dropdown
          trigger={
            <button>
              <Ellipsis size={isFullPlayer ? 20 : 12} />
            </button>
          }
          menu={
            <div className="bg-white divide-zinc-300 divide-y">
              <div className="px-2 py-0.5" onClick={() => handleLikeClick(song.id)}>
                {listList.has(song.id) ? '取消收藏' : '收藏'}
              </div>
              <div className="px-2 py-0.5" onClick={() => handlePlayNextLast(1)}>
                插播
              </div>
              <div className="px-2 py-0.5" onClick={() => handlePlayNextLast(-1)}>
                最后播放
              </div>
              <div className="px-2 py-0.5" onClick={() => navigate(`/album/${song.al.id}`)}>
                前往专辑
              </div>
            </div>
          }></Dropdown>
      </div>
    </div>
  )
}

export default SongInfo
