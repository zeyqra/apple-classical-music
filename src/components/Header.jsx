import { useEffect, useRef, useState } from 'react'
import useAppStore from '../stores/useAppStore'
import Login from './Login'
import Player from './Player'
import { useLoginStatus } from '../hooks/useAuth'
import DropDown from './DropDown'

const Header = () => {
  const setIsSbOpen = useAppStore(state => state.setIsSbOpen)
  const setSbType = useAppStore(state => state.setSbType)
  const isSbOpen = useAppStore(state => state.isSbOpen)
  const handleQueueClick = () => {
    setIsSbOpen(!isSbOpen)
    setSbType('queue')
  }

  const { data: loginStatusData } = useLoginStatus()
  console.log('console: loginStatusData', loginStatusData)
  const avatarUrl = loginStatusData?.data.profile.avatarUrl

  return (
    <div className="Header flex items-center justify-between">
      {/* player */}
      <Player />

      <div className="flex gap-1">
        {/* lyric */}

        {/* queue */}
        <div onClick={handleQueueClick}>Queue</div>

        {/* user */}
        {avatarUrl ? (
          <DropDown
            trigger={
              <button className="w-6 h-6 rounded-full">
                <img className="w-6 h-6 rounded-full" src={avatarUrl} alt="avatar" />
              </button>
            }
            menu={<div>Menu Content123</div>}
          />
        ) : (
          <Login />
        )}
      </div>
    </div>
  )
}

export default Header
