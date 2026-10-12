import { NavLink } from 'react-router-dom'
import Search from './Search'
import InfiniteLoading from './InfiniteLoading'
import { useUserPlaylistCreate } from '../services/music'

const Menubar = () => {
  const {
    data: listData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPlaylistCreate({ offset: 0, limit: 20 })
  const list = listData?.pages?.flatMap(p => p.data.playlist) || []
  return (
    <div className="flex flex-col gap-1 h-full">
      <div className="sticky top-0 p-2 pb-0">
        <h1 className="text-xl font-bold mb-2">React Mini Music</h1>
        <Search />
      </div>
      <div className="p-2 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <NavLink className="py-1" to="/">
            Home
          </NavLink>
        </div>
        <div>
          <span className="text-zinc-500">Library</span>
          <div>
            <NavLink className="py-1 block" to="/library/albums">
              Albums
            </NavLink>
          </div>
        </div>
        <div>
          <span className="text-zinc-500">Playlists</span>
          {list.map(item => (
            <div key={item.id}>
              <NavLink
                className="py-1 block overflow-hidden text-ellipsis whitespace-nowrap"
                to={`/playlist/${item.id}`}>
                {item.name}
              </NavLink>
            </div>
          ))}
          <InfiniteLoading
            list={list}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}></InfiniteLoading>
        </div>
      </div>
    </div>
  )
}

export default Menubar
