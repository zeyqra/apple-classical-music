import { RouterProvider } from 'react-router-dom'
import router from './router'
import { PlayerProvider } from './PlayerContext'

function App() {
  return (
    <div>
      <PlayerProvider>
        <RouterProvider router={router} />
      </PlayerProvider>
    </div>
  )
}

export default App
