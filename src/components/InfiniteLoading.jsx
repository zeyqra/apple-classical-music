import { useEffect, useRef } from 'react'

const InfiniteLoading = ({ fetchNextPage, hasNextPage, isFetchingNextPage }) => {
  const loadMoreRef = useRef(null)
  useEffect(() => {
    if (!loadMoreRef.current) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1 }
    )

    observer.observe(loadMoreRef.current)

    return () => observer.disconnect(loadMoreRef.current)
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div ref={loadMoreRef} className="h-10 flex items-center justify-center mt-1">
      {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'Load More' : 'No more'}
    </div>
  )
}

export default InfiniteLoading
