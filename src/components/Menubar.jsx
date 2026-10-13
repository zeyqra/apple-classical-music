import { NavLink } from 'react-router-dom'
import Search from './Search'
import InfiniteLoading from './InfiniteLoading'
import { useUserPlaylistCreate } from '../services/music'
import { useRequest } from '../hooks/useRequest'

const Menubar = () => {
  const { result, isLoading, error } = useRequest({
    path: '/user/playlist/create' + '?uid=1645212553',
  })
  console.log('console: ', result)
  // const {
  //   data: listData,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  // } = useUserPlaylistCreate({ offset: 0, limit: 20 })
  const list = []
  return (
    <div className="flex flex-col h-full">
      {/* logo + 搜索栏 */}
      <div className="sticky top-0">
        <h1>React Mini Music</h1>
        <Search />
      </div>
      <div className="overflow-y-auto">
        <div className="flex flex-col">
          <NavLink to="/">主页</NavLink>
          <NavLink to="/">浏览</NavLink>
        </div>
        {/* 媒体库 */}
        <div>
          <div className="text-zinc-400">媒体库</div>
          <div>
            <NavLink to="/library/albums">我的专辑</NavLink>
          </div>
        </div>
        {/* 播放列表 */}
        <div>
          <span className="text-zinc-400">播放列表</span>
          {list.map(item => (
            <div key={item.id}>
              <NavLink
                className="block overflow-hidden text-ellipsis whitespace-nowrap"
                to={`/playlist/${item.id}`}>
                {item.name}
              </NavLink>
            </div>
          ))}
          {/* <InfiniteLoading
            list={list}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}></InfiniteLoading> */}
        </div>
      </div>
    </div>
  )
}

export default Menubar
