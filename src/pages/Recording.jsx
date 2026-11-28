import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api.js'
import Menu from '../components/Menu.jsx'
import TracksGrouped from '../components/TracksGrouped.jsx'
import { useActions, useQuery, useStatus } from '../hooks.js'
import { usePlayer } from '../PlayerContext.jsx'

const Work = () => {
  const { id: work_id } = useParams()
  const { result } = useQuery({ queryFn: api.recording, params: { id: work_id } })
  const {
    id,
    title = '',
    composer_id,
    composer_name = '',
    choice_album = {},
    recordings = [],
    relatives = [],
  } = result || {}

  const { isFavourite } = useStatus()
  const { handleFavourite, handleUnfavourite, handleFetchTracksPlay, handleNavigateTo } =
    useActions()

  return (
    <div>
      {/* 作品信息 */}
      <div className="flex">
        <div>
          <div>{composer_name}</div>
          <div>{title}</div>
        </div>
        {!isFavourite({ id, type: 'work' }) && (
          <button onClick={() => handleFavourite({ id, type: 'work' })}>Favourite</button>
        )}
        {!!isFavourite({ id, type: 'work' }) && (
          <button onClick={() => handleUnfavourite({ id, type: 'work' })}>Unfavourite</button>
        )}
      </div>
      {/* 推荐专辑 */}
      <h1>Choice Album</h1>
      <div className="flex">
        <div>{choice_album.title}</div>
        <button onClick={() => handleFetchTracksPlay({ type: 'album', id: choice_album.id })}>
          ▶
        </button>
      </div>

      {/* 热门录音 */}
      <h1>Hot Recordings</h1>
      <div>
        {recordings.map(({ id, performers }) => (
          <div key={id} onClick={() => handleNavigateTo({ type: 'recording', id })}>
            {performers.map(pfm => pfm.name).join('、')}
          </div>
        ))}
      </div>

      {/* 相关作品 */}
      <h1>Relative Wroks</h1>
      <div>
        {relatives.map(({ id, title, composer_id, composer_name }) => (
          <div key={id}>
            <div>{composer_name}</div>
            <div>{title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Work
