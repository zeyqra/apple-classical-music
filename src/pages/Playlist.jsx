import { useLike, useLikeList, usePlaylistDetail, usePlaylistTrackAll } from '../services/music'
import { addSongToQueue, msToHms } from '../utils'
import useMusicStore from '../stores/music'
import Dropdown from '../libs/Dropdown'
import { ChartNoAxesColumn, Play, Star } from 'lucide-react'
import InfiniteSongs from '../components/InfiniteSongs'
import { useParams } from 'react-router-dom'
import Loading from '../libs/Loading'
import Image from '../components/Image'

const Favourites = () => {
  const { id } = useParams()
  const { data: detailData, isLoading, error } = usePlaylistDetail({ id })
  const { playlist: { name, coverImgUrl, updateTime, trackCount, tags } = {} } = detailData || {}

  const {
    data: listData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePlaylistTrackAll({
    id: Number(id),
    offset: 0,
    limit: 20,
    total: trackCount,
  })

  const songs = listData?.pages.flatMap(p => p.songs) || []
  const playAlbum = useMusicStore(state => state.playAlbum)
  const queue = useMusicStore(state => state.queue) // 默认 []
  const index = useMusicStore(state => state.index) // 默认 null
  const song = queue[index] || {}
  const songId = song?.id

  const getAlbumSongs = () =>
    songs.map(song => ({
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

  const handlePlayNextLast = (albumIndex, delta) => {
    const song = songs[albumIndex]
    const songToPlay = {
      id: song.id,
      name: song.name,
      dt: song.dt,
      alPicUrl: song.al.picUrl,
      artists: song.ar.map(artist => artist.name).join('/'),
    }
    addSongToQueue(songToPlay, delta)
  }

  const handlePlayAlbumNextLast = delta => {
    addSongToQueue(getAlbumSongs(), delta)
  }

  const { data: listList = new Set() } = useLikeList()
  const { mutate: like } = useLike()
  const handleLikeClick = id => {
    like({ id, like: !listList.has(id), playlistId: id })
  }

  if (isLoading) return <Loading />

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 flex gap-2 p-1 sticky top-0 bg-white z-20 border-b border-zinc-300">
        <Image className="w-45 h-45 object-cover" src={`${coverImgUrl}?param=300y300`} alt={name} />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl">{name}</h2>
            {/* <div className="text-2xl">{info.artist.name}</div> */}
            <div>{`更新时间 · ${new Date(updateTime).toLocaleDateString()}`}</div>
          </div>
          <div className="flex justify-between items-center">
            <button onClick={() => handlePlayClick(0)}>Play</button>
            <div className="flex gap-2">
              {/* {<button onClick={handleSubClick}>{isSub ? '√ Remove' : '+ Add'}</button>} */}
              <Dropdown
                pos="left"
                trigger={<button>···</button>}
                menu={
                  <div className=" bg-white">
                    <div className=" bg-white divide-zinc-300 divide-y">
                      <div className="px-2 py-0.5" onClick={() => handlePlayAlbumNextLast(1)}>
                        Play Next
                      </div>
                      <div className="px-2 py-0.5" onClick={() => handlePlayAlbumNextLast(-1)}>
                        Play Last
                      </div>
                      {/* <div className="px-2 py-0.5" onClick={handleSubClick}>
                        {isSub ? 'Undo Favourite' : 'Favourite'}
                      </div> */}
                    </div>
                  </div>
                }></Dropdown>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <InfiniteSongs
          list={songs}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}></InfiniteSongs>
      </div>
    </div>
  )
}

export default Favourites
