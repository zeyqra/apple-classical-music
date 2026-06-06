import { Outlet } from 'react-router-dom'
import useAppStore from '../stores/useAppStore'

const MainLayout = ({ header, menubar, sidebar }) => {
  const isSbOpen = useAppStore(state => state.isSbOpen)
  return (
    <div className="MainLayout h-screen flex">
      <div className="w-[280px] h-full">{menubar}</div>

      <div className="flex-1 h-full" style={{ width: 'calc(100% - 280px)' }}>
        <header className="header">{header}</header>
        <div className="w-full flex h-[calc(100% - 50px)]">
          <main className="flex-1 box-border p-4 h-full">
            <Outlet />
          </main>

          {isSbOpen && <div className="w-[280px] h-full">{sidebar}</div>}
        </div>
      </div>
    </div>
  )
}

export default MainLayout
