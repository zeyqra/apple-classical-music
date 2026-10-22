import { useParams } from 'react-router-dom'
import {
  useAlbum,
  useAlbumDetailDynamic,
  useAlbumSub,
  useLike,
  useLikeList,
} from '../services/music'
import { addSongToQueue, msToHms } from '../utils'
import useMusicStore from '../stores/music'
import Dropdown from '../libs/Dropdown'
import { ChartNoAxesColumn, Check, Ellipsis, Play, Plus, Star } from 'lucide-react'
import Loading from '../libs/Loading'
import Image from '../components/Image'
import Dialog from '../libs/Dialog'
import { useState } from 'react'

const Album = () => {
  const { id } = useParams()
  const { data, isLoading, error } = useAlbum({ id })
  const playAlbum = useMusicStore(state => state.playAlbum)
  const queue = useMusicStore(state => state.queue) // 默认 []
  const index = useMusicStore(state => state.index) // 默认 null
  const song = queue[index] || {}
  const songId = song?.id

  const getAlbumSongs = () =>
    data?.songs.map(song => ({
      id: song.id,
      name: song.name,
      dt: song.dt,
      alPicUrl: song.al.picUrl,
      artists: song.ar.map(artist => artist.name).join('/'),
      al: song.al,
    }))

  const handlePlayClick = index => {
    playAlbum(getAlbumSongs(), index)
  }

  const { data: dynamicData } = useAlbumDetailDynamic({ id })
  const { mutate: albumSubMutate } = useAlbumSub({ id })
  const isSub = dynamicData?.isSub
  const handleSubClick = () => {
    albumSubMutate({ id, t: isSub ? 0 : 1 })
  }

  const handlePlayNextLast = (albumIndex, delta) => {
    const song = data.songs[albumIndex]
    const songToPlay = {
      id: song.id,
      name: song.name,
      dt: song.dt,
      alPicUrl: song.al.picUrl,
      artists: song.ar.map(artist => artist.name).join('/'),
      al: song.al,
    }
    addSongToQueue(songToPlay, delta)
  }

  const handlePlayAlbumNextLast = delta => {
    addSongToQueue(getAlbumSongs(), delta)
  }

  const { data: likeList } = useLikeList()
  const { mutate: like } = useLike()
  const handleLikeClick = id => {
    like({ id, like: !likeList?.has(id) })
  }

  const [desOpen, setDesOpen] = useState(false)

  if (isLoading) return <Loading />

  const { album, songs } = data
  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 flex gap-2 p-1 sticky top-0 bg-white z-10 border-b border-zinc-300">
        <div className="w-45 h-45">
          <Image
            className="w-full h-full object-cover"
            src={`${album.picUrl}?param=300y300`}
            alt={album.name}
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold">{album.name}</h2>
            <div className="text-2xl">{album.artist.name}</div>
            <div>{`${album.type} · ${new Date(album.publishTime).toLocaleDateString()}`}</div>
          </div>
          <div>
            {/* 介绍 */}
            <div className="relative text-sm line-clamp-3 overflow-hidden w-[50%] mb-2">
              <div className="text-zinc-500">{album.description}</div>
              <button
                className="absolute bottom-0 right-0 bg-white shadow-[-10px_0_10px_#fff]"
                onClick={() => setDesOpen(true)}>
                更多
              </button>
              <Dialog isOpen={desOpen} onClose={() => setDesOpen(false)}>
                <div className="flex flex-col max-h-[80vh] w-[40vw]">
                  <div className="sticky p-2">
                    <div className="text-2xl font-bold">{album.name}</div>
                    <div>
                      {album.artist.name} · {new Date(album.publishTime).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="p-2 pt-0 flex-1 overflow-auto text-zinc-500">
                    {album.description}
                  </div>
                </div>
              </Dialog>
            </div>
            <div className="flex justify-between items-center">
              <button className="flex items-center gap-1" onClick={() => handlePlayClick(0)}>
                <Play size={15} fill="currentColor" />
                播放
              </button>
              <div className="flex gap-2">
                {
                  <button className="flex items-center gap-1" onClick={handleSubClick}>
                    {isSub ? (
                      <>
                        <Check size={16} /> 取消收藏
                      </>
                    ) : (
                      <>
                        <Plus size={16} /> 收藏
                      </>
                    )}
                  </button>
                }
                <Dropdown
                  trigger={
                    <button>
                      <Ellipsis size={16} />
                    </button>
                  }
                  menu={
                    <div className=" bg-white">
                      <div className=" bg-white divide-zinc-300 divide-y">
                        <div className="px-2 py-0.5" onClick={() => handlePlayAlbumNextLast(1)}>
                          插播
                        </div>
                        <div className="px-2 py-0.5" onClick={() => handlePlayAlbumNextLast(-1)}>
                          最后播放
                        </div>
                        <div className="px-2 py-0.5" onClick={handleSubClick}>
                          {isSub ? '取消收藏' : '收藏'}
                        </div>
                      </div>
                    </div>
                  }></Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ul className="p-1 overflow-y-auto flex-1">
        {songs.map((song, index) => (
          <li
            key={song.id}
            className="flex justify-between items-center group py-0.5 cursor-default">
            <div className="flex items-center gap-1">
              {/* <div
                className="w-[8px] h-[8px] shrink-0 flex items-center justify-center"
                onClick={() => handleLikeClick(song.id)}>
                {likeList?.has(song.id) ? (
                  <Star size={8} fill="currentColor" />
                ) : (
                  <Star className="opacity-0 group-hover:opacity-100" size={8} />
                )}
              </div> */}
              <div className="w-6 shrink-0 flex items-center justify-center">
                {songId === song.id ? (
                  <ChartNoAxesColumn size={15} />
                ) : (
                  <>
                    <div className="group-hover:hidden">{index + 1}</div>
                    <button
                      className="hidden group-hover:inline-block"
                      onClick={() => handlePlayClick(index)}>
                      <Play size={15} fill="currentColor" />
                    </button>
                  </>
                )}
              </div>
              <span>{song.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{msToHms(song.dt)}</span>
              <Dropdown
                trigger={
                  <button>
                    <Ellipsis size={16} />
                  </button>
                }
                menu={
                  <div className=" bg-white divide-zinc-300 divide-y">
                    <div className="px-2 py-0.5" onClick={() => handlePlayNextLast(index, 1)}>
                      插播
                    </div>
                    <div className="px-2 py-0.5" onClick={() => handlePlayNextLast(index, -1)}>
                      最后播放
                    </div>
                    <div className="px-2 py-0.5" onClick={() => handleLikeClick(song.id)}>
                      {likeList?.has(song.id) ? '取消收藏' : '收藏'}
                    </div>
                  </div>
                }></Dropdown>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Album
