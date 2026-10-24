import { Outlet } from 'react-router-dom'
import useStore from './store'

const MainLayout = ({ header, menubar, sidebar }) => {
  const isSbOpen = useStore(state => state.isSbOpen)
  return (
    <div className="h-screen w-full overflow-hidden flex">
      {/* 菜单栏 */}
      <div className="w-65">{menubar}</div>

      {/* 右侧 */}
      <div className="w-[calc(100%-16.25rem)] flex flex-col">
        {/* 头部栏 */}
        <header className="sticky top-0 z-50">{header}</header>

        <div className="w-full flex flex-1 overflow-hidden">
          {/* 内容 */}
          <main className="flex-1 relative overflow-hidden">
            <Outlet />
          </main>

          {/* 歌词、列队面板 */}
          {isSbOpen && <div className="w-70">{sidebar}</div>}
        </div>
      </div>
    </div>
  )
}

export default MainLayout
