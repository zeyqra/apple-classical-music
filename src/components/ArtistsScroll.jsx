import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Image from './Image'

const BannerList = ({ title, list }) => {
  const itemsContainer = useRef()
  const handleArrowClick = direction => {
    itemsContainer.current.scrollLeft += itemsContainer.current.offsetWidth * direction
  }

  const navigate = useNavigate()
  const handleItemClick = artist => {
    console.log('console: artist', artist)
    // navigate(`/artist/${artist.id}`)
  }

  return (
    <div className="BannerList px-4">
      <h2>{title}</h2>
      <div className="relative">
        <div
          ref={itemsContainer}
          style={{ width: 'calc(100%)' }}
          className="flex gap-1 overflow-hidden ">
          {list.map(artist => (
            <div
              style={{ width: 'calc(12.5% - 0.25rem)' }}
              className="shrink-0"
              key={artist.id}
              onClick={() => handleItemClick(artist)}>
              <Image
                className="aspect-square w-full object-cover rounded-full"
                src={artist.picUrl}
                alt={artist.name}
              />
              <div className="text-center">{artist.name}</div>
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
