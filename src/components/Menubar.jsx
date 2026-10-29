import { NavLink } from 'react-router-dom'

const Menubar = () => {
  return (
    <div className="flex flex-col h-full">
      {/* logo + 搜索栏 */}
      <div className="sticky top-0">
        <h1>Apple Classical Music</h1>
      </div>
      <div className="overflow-y-auto">
        <div className="flex flex-col">
          <NavLink to="/">主页</NavLink>
        </div>
        {/* 媒体库 */}
        <div>
          <div className="text-zinc-400">媒体库</div>
          <div>
            <div>
              <NavLink to="library/albums">专辑</NavLink>
            </div>
            <div>
              <NavLink to="library/tracks">曲目</NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menubar
