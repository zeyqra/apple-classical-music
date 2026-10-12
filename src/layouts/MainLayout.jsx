import { Outlet } from 'react-router-dom'
import useAppStore from '../stores/app'

const MainLayout = ({ header, menubar, sidebar }) => {
  const isSbOpen = useAppStore(state => state.isSbOpen)
  return (
    <div className="MainLayout h-screen overflow-hidden flex">
      <div className="w-[280px] h-full">{menubar}</div>

      <div className="flex-1 h-full flex flex-col" style={{ width: 'calc(100% - 280px)' }}>
        <header className="header h-12 sticky top-0 z-50 shrink-0">{header}</header>
        <div className="w-full flex flex-1 overflow-hidden">
          <main className="flex-1 box-border h-full relative overflow-hidden">
            <Outlet />
          </main>

          {isSbOpen && <div className="w-[280px] h-full border-l border-zinc-300">{sidebar}</div>}
        </div>
      </div>
    </div>
  )
}

export default MainLayout
