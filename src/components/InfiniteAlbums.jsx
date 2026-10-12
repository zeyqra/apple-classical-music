import InfiniteLoading from './InfiniteLoading'

const InfiniteAlbums = ({ list, fetchNextPage, hasNextPage, isFetchingNextPage, renderItem }) => {
  return (
    <div className="InfiniteAlbums p-1 h-full overflow-y-auto">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-1 ">
        {list.length > 0 && list.map(renderItem)}
      </div>
      {list.length > 0 && (
        <InfiniteLoading
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
    </div>
  )
}

export default InfiniteAlbums
