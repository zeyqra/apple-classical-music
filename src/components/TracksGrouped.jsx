import { useActions, useStatus } from '../hooks'
import { tracksGroupByRecording } from '../utils'
import Menu from './Menu'

const TracksGrouped = ({ tracks: orgTracks, hasToAlbum = true, onTrackPlay }) => {
  const tracksGrouped = tracksGroupByRecording(orgTracks)
  const { handleAddToLibrary } = useActions()
  const { isInLibrary } = useStatus()
  return (
    <div>
      {tracksGrouped.map(
        ({
          recording: { id, composer_id, composer_name, work_id, work_title, performers },
          tracks,
        }) => {
          return (
            // 录音组
            <div key={tracks[0].id}>
              {/* 录音信息 */}
              <div className="flex">
                <div>
                  <div>
                    {composer_name}: {work_title}
                  </div>
                  <div>{performers.map(p => p.name).join(' / ')}</div>
                </div>
                <Menu
                  actions={['FAVOURITE']}
                  target={{
                    id,
                    composer_id,
                    composer_name,
                    work_id,
                    work_title,
                    performers,
                    type: 'recording',
                  }}
                />
              </div>

              {/* 曲目组 */}
              <div>
                {tracks.map(t => (
                  <div key={t.id}>
                    <span
                      onClick={() =>
                        onTrackPlay({ index: orgTracks.findIndex(tk => tk.id === t.id) })
                      }>
                      ▶
                    </span>
                    <span>{t.title} </span>
                    {!isInLibrary({ targetId: t.id, targetType: 'track' }) && (
                      <button
                        onClick={() => handleAddToLibrary({ targetId: t.id, targetType: 'track' })}>
                        +
                      </button>
                    )}
                    <Menu
                      actions={[
                        'LIBRARY',
                        'PLAYLIST',
                        ...(hasToAlbum ? ['TO_ALBUM'] : []),
                        'TO_RECORDING',
                        'FAVOURITE',
                      ]}
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

export default TracksGrouped
