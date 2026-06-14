import { useEffect, useRef, useState } from 'react'
import useAppStore from '../stores/app'
import Login from './Login'
import Player from './Player'
import { useLoginStatus } from '../services/user'
import DropDown from './DropDown'
import useUserStore from '../stores/user'
import { logout } from '../services/user'

const Header = () => {
  const setIsSbOpen = useAppStore(state => state.setIsSbOpen)
  const setSbType = useAppStore(state => state.setSbType)
  const isSbOpen = useAppStore(state => state.isSbOpen)
  const handleQueueClick = () => {
    setIsSbOpen(!isSbOpen)
    setSbType('queue')
  }

  const cookie = useUserStore(state => state.cookie)
  const { data: loginStatusData } = useLoginStatus()
  console.log('console: loginStatusData', loginStatusData)
  const avatarUrl = loginStatusData?.data.profile.avatarUrl

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="Header flex items-center justify-between gap-4">
      {/* player */}
      <Player />

      <div className="flex gap-4">
        {/* lyric */}

        {/* queue */}
        <div onClick={handleQueueClick}>Queue</div>

        {/* user */}
        {cookie ? (
          <DropDown
            trigger={
              <button className="w-6 h-6 rounded-full">
                <img className="w-6 h-6 rounded-full" src={avatarUrl} alt="avatar" />
              </button>
            }
            menu={
              <div>
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
