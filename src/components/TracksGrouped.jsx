import { tracksGroupByRecording } from '../utils'
import Menu from './Menu'

const TracksGrouped = ({ tracks: orgTracks, onTrackPlay, onTracksGroupedMenuClick }) => {
  const tracksGrouped = tracksGroupByRecording(orgTracks)
  return (
    <div>
      {tracksGrouped.map(
        ({
          recording: {
            id,
            composer_id,
            composer_name,
            work_id,
            work_title,
            performers,
            isFavourite,
          },
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
                  isFavourite={isFavourite}
                  onMenuClick={({ action }) =>
                    onTracksGroupedMenuClick({ id, type: 'recording', action })
                  }
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
                    {!t.isInLibrary && (
                      <button
                        onClick={() =>
                          onTracksGroupedMenuClick({
                            id: t.id,
                            type: 'track',
                            action: 'ADD_TO_LIBRARY',
                          })
                        }>
                        +
                      </button>
                    )}
                    <Menu
                      actions={['LIBRARY', 'PLAYLIST', 'TO_RECORDING', 'FAVOURITE']}
                      isInLibrary={t.isInLibrary}
                      isFavourite={t.isFavourite}
                      onMenuClick={({ action, playlistId }) =>
                        onTracksGroupedMenuClick({ id: t.id, type: 'track', action, playlistId })
                      }
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
