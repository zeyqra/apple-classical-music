import { useEffect } from 'react'
import useStore from '../store'
import { useQuery } from '../hooks'
import { playlist } from '../api'
import DropMenu from '../components/DropMenu'

const PlaylistsCreated = () => {
  const playlistCreated = useStore(state => state.playlistCreated)
  const one = playlistCreated[0] || {}
  const { result } = useQuery(playlist, { id: one.id })
  return (
    <div className="flex">
      {/* 列表 */}
      <div className="w-70">
        {playlistCreated.map(p => (
          <div key={p.id}>{p.title || '无'}</div>
        ))}
      </div>
      {/* 详情 */}
      <div className="grow">
        <div>{one.title || '无'}</div>
        <DropMenu type="playlist" playlistId={one.id} />
        <div>
          {result?.tracks?.map(t => (
            <div>{t.title}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlaylistsCreated
