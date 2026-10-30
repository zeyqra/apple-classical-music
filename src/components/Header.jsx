import useStore from '../store.js'
import ProgressBar from './ProgressBar'
import VolBar from './VolBar'
import { usePlayer } from '../PlayerContext.jsx'
import Controller from './Controller'

const Header = () => {
  const { controller, track, progress, volumn } = usePlayer()

  const setIsSbOpen = useStore(state => state.setIsSbOpen)
  const sbType = useStore(state => state.sbType)
  const setSbType = useStore(state => state.setSbType)
  const isSbOpen = useStore(state => state.isSbOpen)
  const handleQueueClick = () => {
    if (!isSbOpen) setIsSbOpen(true)
    if (isSbOpen && sbType === 'queue') setIsSbOpen(false)
    setSbType('queue')
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
                {/* <div>
                  {Object.entries(track.performers)
                    .filter(([_, pfs]) => pfs.length >= 1)
                    .map(([role, pfs]) => pfs.map(pf => pf.name).join(' / '))
                    .join(' / ')}
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

      {/* lyric queue*/}
      <button onClick={handleQueueClick}>QEN</button>
    </div>
  )
}

export default Header
