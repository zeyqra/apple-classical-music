import { RouterProvider } from 'react-router-dom'
import router from './router'
import { PlayerProvider } from './PlayerContext'
import useStore from './store'

function App() {
  const setRelations = useStore(state => state.setRelations)
  const setCreatedPlaylist = useStore(state => state.setCreatedPlaylist)
  setTimeout(() => {
    console.log('console: ', useStore.getState())
  }, 2000)
  setRelations()
  setCreatedPlaylist()
  return (
    <div>
      <PlayerProvider>
        <RouterProvider router={router} />
      </PlayerProvider>
    </div>
  )
}

export default App
