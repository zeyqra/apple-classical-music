import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10分钟
      gcTime: 1000 * 60 * 60, // 30分钟
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
})
window.__TANSTACK_QUERY_CLIENT__ = queryClient

export default queryClient
