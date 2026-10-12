import useAppStore from '../stores/app'
import Login from './Login'
import Player from './Player'
import { useLoginStatus } from '../services/user'
import DropDown from '../libs/Dropdown'
import useUserStore from '../stores/user'
import { logout } from '../services/user'
import { ListMusic, MessageSquareQuote } from 'lucide-react'
import ImgLazy from './ImgLazy'

const Header = () => {
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
  console.log('console: loginStatusData', loginStatusData)
  const avatarUrl = loginStatusData?.data.profile.avatarUrl

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="Header h-full flex items-center justify-between border-b border-zinc-300">
      {/* player */}
      <Player />

      <div className="flex items-center justify-end gap-4 w-[10%] mr-4">
        {/* lyric */}

        {/* queue */}
        <div className="flex items-center gap-4">
          <div onClick={handleLyricClick}>
            <MessageSquareQuote size={20} />
          </div>
          <ListMusic onClick={handleQueueClick} size={20} />
        </div>

        {/* user */}
        {cookie ? (
          <DropDown
            trigger={
              <button className="w-6 h-6 rounded-full">
                <ImgLazy className="w-6 h-6 rounded-full" src={avatarUrl} alt="avatar" />
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
    </div>
  )
}

export default Header
