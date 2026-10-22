import useAppStore from '../stores/app'
import Login from './Login'
import Player from './Player'
import { useLoginStatus } from '../services/user'
import DropDown from '../libs/Dropdown'
import useUserStore from '../stores/user'
import { logout } from '../services/user'
import { ListMusic, MessageSquareQuote } from 'lucide-react'
import Image from './Image'
import ProgressBar from './ProgressBar'
import VolBar from './VolBar'
import { usePlayer } from '../context/player'
import Controller from './Controller'
import SongInfo from './SongInfo'
import Cover from './Cover'
import FullPlayer from './FullPlayer'
import { Maximize2, Music } from 'lucide-react'
import { Star, Ellipsis } from 'lucide-react'
import { useLike, useLikeList } from '../services/music'
import Dropdown from '../libs/Dropdown'
import { addSongToQueue } from '../utils'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { controller, track, progress, volumn } = usePlayer()
  // const setShowFullPlayer = useAppStore(state => state.setShowFullPlayer)
  const handleCoverClick = () => {
    // setShowFullPlayer(true)
  }
  // const { data: listList = new Set() } = useLikeList()
  // const { mutate: like } = useLike()
  // const handleLikeClick = id => {
  //   like({ id, like: !listList.has(id), playlistId: id })
  // }
  const handlePlayNextLast = delta => {
    const trackToPlay = {
      id: track.id,
      name: track.name,
      dt: track.dt,
      alPicUrl: (track.al || track.album).picUrl,
      artists: track.ar.map(artist => artist.name).join('/'),
    }
    addSongToQueue(trackToPlay, delta)
  }
  const navigate = useNavigate()

  const setIsSbOpen = useAppStore(state => state.setIsSbOpen)
  const sbType = useAppStore(state => state.sbType)
  const setSbType = useAppStore(state => state.setSbType)
  const isSbOpen = useAppStore(state => state.isSbOpen)
  const handleQueueClick = () => {
    if (!isSbOpen) setIsSbOpen(true)
    if (isSbOpen && sbType === 'queue') setIsSbOpen(false)
    setSbType('queue')
  }
  const handleLyricClick = () => {
    if (!isSbOpen) setIsSbOpen(true)
    if (isSbOpen && sbType === 'lyric') setIsSbOpen(false)
    setSbType('lyric')
  }
  const cookie = useUserStore(state => state.cookie)
  const { data: loginStatusData } = useLoginStatus()
  const avatarUrl = loginStatusData?.data.profile.avatarUrl
  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex justify-between border-b border-zinc-500">
      {/* 按钮 */}
      <Controller {...controller} />

      {/* 音乐封面、标题、进度条等 */}
      <div className="flex w-[40%]">
        {/* 封面 */}
        {/* <div className="relative w-10 h-10" onClick={handleCoverClick}>
          <Cover track={track} />
        </div> */}

        <div className={`flex-1 flex flex-col text-xs`}>
          {track ? (
            <>
              {/* 音乐标题、艺术家、收藏按钮等 */}
              <div className="relative flex flex-col items-center whitespace-nowrap text-ellipsis">
                <div>
                  {track.work_title} - {track.title}
                </div>
                <div>
                  {Object.entries(track.performers)
                    .filter(([_, pfs]) => pfs.length >= 1)
                    .map(([role, pfs]) => pfs.map(pf => pf.name).join(' / '))
                    .join(' / ')}
                </div>
                {/* 收藏按钮、菜单
                <div className="absolute top-0 right-0 flex gap-1">
                  收藏
                  <button onClick={() => handleLikeClick(track.id)}>
                    {listList.has(track.id) ? 'STAR' : 'UNSTAR'}
                  </button>
                  菜单
                  <Dropdown
                    trigger={<button>MENU</button>}
                    menu={
                      <div className="bg-white">
                        <div onClick={() => handleLikeClick(track.id)}>
                          {listList.has(track.id) ? '取消收藏' : '收藏'}
                        </div>
                        <div onClick={() => handlePlayNextLast(1)}>插播</div>
                        <div onClick={() => handlePlayNextLast(-1)}>最后播放</div>
                        <div onClick={() => navigate(`/album/${track.al.id}`)}>前往专辑</div>
                      </div>
                    }></Dropdown>
                </div> */}
              </div>

              {/* 进度条 */}
              <ProgressBar {...progress} />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              APPLE MUSIC CLASSICAL
            </div>
          )}
        </div>
      </div>

      {/* volume control */}
      <VolBar {...volumn} />

      <FullPlayer />

      {/* lyric queue*/}
      <button onClick={handleLyricClick}>LYC</button>
      <button onClick={handleQueueClick}>QEN</button>

      {/* user */}
      {cookie ? (
        <DropDown
          trigger={
            <button className="w-6 h-6">
              <Image src={avatarUrl} />
            </button>
          }
          menu={
            <div className="bg-white">
              <button onClick={handleLogout}>Logout</button>
            </div>
          }
        />
      ) : (
        <Login />
      )}
    </div>
  )
}

export default Header
