import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import queryClient from './services/queryClient'
// import { useTheme } from './hooks/useTheme'

function App() {
  // useTheme()
  return (
    <div className="App dark:*:bg-zinc-900 dark:text-zinc-100">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  )
}

export default App
