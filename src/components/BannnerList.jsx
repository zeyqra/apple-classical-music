import { useRef } from 'react'

const BannerList = ({ title, useQuery, useQueryParams, onItemClick }) => {
  const { data, isLoading, error } = useQuery(useQueryParams)

  const itemsContainer = useRef()
  const handleArrowClick = direction => {
    itemsContainer.current.scrollLeft += itemsContainer.current.offsetWidth * direction
  }

  if (isLoading) return 'Loading...'
  if (error) return 'Error!'

  const list = data.albums
  return (
    <div className="BannerList">
      <h2>{title}</h2>
      <div className="relative">
        <div
          ref={itemsContainer}
          style={{ width: 'calc(100%)' }}
          className="flex gap-1 overflow-hidden ">
          {list.map(album => (
            <div
              style={{ width: 'calc(20% - 0.25rem)' }}
              className="shrink-0"
              key={album.id}
              onClick={() => onItemClick(album)}>
              <img src={album.blurPicUrl} alt={album.name} />
              {album.name}
              {album.artist.name}
            </div>
          ))}
        </div>
        <span
          className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() => handleArrowClick(-1)}>
          &lt;
        </span>
        <span
          className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() => handleArrowClick(1)}>
          &gt;
        </span>
      </div>
    </div>
  )
}

export default BannerList
