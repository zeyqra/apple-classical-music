import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()
window.__TANSTACK_QUERY_CLIENT__ = queryClient

export default queryClient
