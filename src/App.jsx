import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import queryClient from './services/queryClient'
import { PlayerProvider } from './context/player'
// import { useTheme } from './hooks/useTheme'

function App() {
  // useTheme()
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <PlayerProvider>
          <RouterProvider router={router} />
        </PlayerProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App
