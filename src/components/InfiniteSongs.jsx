import InfiniteLoading from './InfiniteLoading'
import Dropdown from '../libs/Dropdown'
import { ChartNoAxesColumn, Ellipsis, Play } from 'lucide-react'
import useMusicStore from '../stores/music'
import { useLike, useLikeList } from '../services/music'
import { addSongToQueue, msToHms } from '../utils'
import ImgLazy from './ImgLazy'

const InfiniteSongs = ({ list, fetchNextPage, hasNextPage, isFetchingNextPage }) => {
  const playAlbum = useMusicStore(state => state.playAlbum)
  const queue = useMusicStore(state => state.queue) // 默认 []
  const index = useMusicStore(state => state.index) // 默认 null
  const song = queue[index] || {}
  const songId = song?.id

  const getAlbumSongs = () =>
    list.map(song => ({
      id: song.id,
      name: song.name,
      dt: song.dt,
      alPicUrl: (song.al || song.album).picUrl,
      artists: (song.ar || song.artists).map(artist => artist.name).join('/'),
      al: song.al,
    }))

  const handlePlayClick = index => {
    playAlbum(getAlbumSongs(), index)
  }

  const handlePlayNextLast = (albumIndex, delta) => {
    const song = list[albumIndex]
    const songToPlay = {
      id: song.id,
      name: song.name,
      dt: song.dt,
      alPicUrl: (song.al || song.album).picUrl,
      artists: song.ar.map(artist => artist.name).join('/'),
      al: song.al,
    }
    addSongToQueue(songToPlay, delta)
  }

  const { data: listList = new Set() } = useLikeList()
  const { mutate: like } = useLike()
  const handleLikeClick = id => {
    like({ id, like: !listList.has(id), playlistId: id })
  }
  return (
    <div className="flex flex-col h-full">
      <li className="shrink-0 flex justify-between items-center group py-1 cursor-default bg-white border-b border-zinc-300 z-10 sticky top-0">
        <div className="flex items-center flex-1 gap-2">
          <div className="w-[2%] shrink-0 text-center"></div>
          <div className="w-10 shrink-0 flex items-center justify-center">歌曲</div>
          <div className="w-[30%] flex-[1,0,auto]  line-clamp-2 wrap-break-word"></div>
          <div className="w-[30%] flex-[1,0,auto]  line-clamp-2 wrap-break-word">歌手</div>
          <div className="w-[30%] flex-[1,0,auto]  line-clamp-2 wrap-break-word">专辑</div>
        </div>
        <div className="flex items-center gap-2 w-[6%]">
          <div>时长</div>
        </div>
      </li>
      <div className="overflow-y-auto flex-1">
        <ul className="p-2 pt-0">
          {list.map((song, index) => (
            <li
              key={song.id}
              className="flex justify-between items-center group py-0.5 cursor-default">
              {/* 左对齐field */}
              <div className="flex items-center flex-1 gap-2">
                {/* <div
                className="w-[8px] h-[8px] shrink-0 flex items-center justify-center"
                onClick={() => handleLikeClick(song.id)}>
                {listList.has(song.id) ? (
                  <Star size={8} fill="currentColor" />
                ) : (
                  <Star className="opacity-0 group-hover:opacity-100" size={8} />
                )}
              </div> */}
                <div className="w-[2%] shrink-0 text-center">
                  {songId === song.id ? (
                    <ChartNoAxesColumn size={15} />
                  ) : (
                    <>
                      <span className="group-hover:hidden">{index + 1}</span>
                      <button
                        className="hidden group-hover:inline-block"
                        onClick={() => handlePlayClick(index)}>
                        <Play size={15} fill="currentColor" />
                      </button>
                    </>
                  )}
                </div>
                {(song.al || song.album).picUrl && (
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                    <ImgLazy
                      src={`${(song.al || song.album).picUrl}?param=180y180`}
                      alt={(song.al || song.album).name}
                    />
                  </div>
                )}
                <div className="w-[30%] flex-[1,0,auto]  line-clamp-2 wrap-break-word">
                  {song.name}
                </div>
                <div className="w-[30%] flex-[1,0,auto]  line-clamp-2 wrap-break-word">
                  {(song.ar || song.artists).map(a => a.name).join('/')}
                </div>
                <div className="w-[30%] flex-[1,0,auto]  line-clamp-2 wrap-break-word">
                  {(song.al || song.album).name}
                </div>
              </div>
              {/* 右对齐field */}
              <div className="flex items-center justify-end gap-2 w-[6%]">
                <div>{msToHms(song.dt || song.duration)}</div>
                <Dropdown
                  trigger={
                    <button>
                      <Ellipsis size={14} />
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
                        {listList.has(song.id) ? '取消收藏' : '收藏'}
                      </div>
                    </div>
                  }></Dropdown>
              </div>
            </li>
          ))}
          {list.length > 0 && (
            <InfiniteLoading
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
            />
          )}
        </ul>
      </div>
    </div>
  )
}

export default InfiniteSongs
