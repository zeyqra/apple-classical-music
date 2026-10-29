import { RouterProvider } from 'react-router-dom'
import router from './router'
import { PlayerProvider } from './PlayerContext'
import useStore from './store'

function App() {
  const setLibraryTracks = useStore(state => state.setLibraryTracks)
  setLibraryTracks()
  return (
    <div>
      <PlayerProvider>
        <RouterProvider router={router} />
      </PlayerProvider>
    </div>
  )
}

export default App
