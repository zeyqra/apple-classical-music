import { useActions } from '../hooks'
import useStore from '../store'
import { tracksGroupByRecording } from '../utils'
import Menu from './Menu'

const Queue = () => {
  const setQueue = useStore(state => state.setQueue)
  const index = useStore(state => state.index)
  const setIndex = useStore(state => state.setIndex)
  const isPlay = useStore(state => state.isPlay)
  const setIsPlay = useStore(state => state.setIsPlay)
  const queue = useStore(state => state.queue)
  const restQueue = queue.slice(index + 1)
  const tracksGrouped = tracksGroupByRecording(restQueue)

  const { handleNavigateTo } = useActions()

  const handlePlayTrack = ({ index }) => {
    !isPlay && setIsPlay(true)
    setIndex(index)
  }

  const handleRemoveTrack = ({ index }) => {
    setQueue(queue.filter((q, i) => i !== index))
  }

  return (
    <div>
      {tracksGrouped.map(
        ({ recording: { id, work_id, composer_name, work_title, performers }, tracks }) => {
          return (
            // 录音组
            <div key={tracks[0].id}>
              {/* 录音信息 */}
              <div className="flex">
                <div>
                  <div onClick={() => handleNavigateTo({ type: 'work', id: work_id })}>
                    {composer_name}: {work_title} {'>'}
                  </div>
                  <div>{performers.map(p => p.name).join(' / ')}</div>
                </div>
              </div>

              {/* 曲目组 */}
              <div>
                {tracks.map(t => (
                  <div className="relative" key={t.id}>
                    <button
                      onClick={() =>
                        handleRemoveTrack({ index: queue.findIndex(tk => tk.id === t.id) })
                      }>
                      -
                    </button>
                    <span
                      onDoubleClick={() =>
                        handlePlayTrack({ index: queue.findIndex(tk => tk.id === t.id) })
                      }>
                      {t.title}{' '}
                    </span>
                    <Menu
                      actions={['LIBRARY', 'PLAYLIST', 'TO_ALBUM', 'FAVOURITE']}
                      target={{ ...t, type: 'track' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        }
      )}
    </div>
  )
}

export default Queue
