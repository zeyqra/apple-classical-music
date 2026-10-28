import { RouterProvider } from 'react-router-dom'
import router from './router'
import { PlayerProvider } from './PlayerContext'
import useStore from './store'

function App() {
  // const fetchLibraryTracks = useStore(state => state.fetchLibraryTracks)
  // fetchLibraryTracks()
  return (
    <div>
      <PlayerProvider>
        <RouterProvider router={router} />
      </PlayerProvider>
    </div>
  )
}

export default App
