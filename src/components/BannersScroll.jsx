import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ImgLazy from './ImgLazy'

const BannersScroll = ({ list }) => {
  const itemsContainer = useRef()
  const handleArrowClick = direction => {
    itemsContainer.current.scrollLeft += itemsContainer.current.offsetWidth * direction
  }

  const navigate = useNavigate()
  const handleItemClick = album => {
    const pathname = album.url.replace('orpheus:/', '')
    navigate(pathname)
  }

  return (
    <div className="BannerList">
      <div className="relative">
        <div ref={itemsContainer} style={{ width: 'calc(100%)' }} className="flex overflow-hidden ">
          {list.map(album => (
            <div
              style={{ width: 'calc(50% - 0.25rem)' }}
              className="shrink-0 mx-0.5"
              key={album.id}
              onClick={() => handleItemClick(album)}>
              <div className="mb-1">{album.typeTitle}</div>
              <div className="h-[280px]">
                <ImgLazy className="w-full h-full object-cover" src={album.imageUrl} />
              </div>
            </div>
          ))}
        </div>
        <button
          className="absolute left-0.5 top-1/2 transform -translate-y-1/2 z-10 bg-white"
          onClick={() => handleArrowClick(-1)}>
          <ChevronLeft size={24} />
        </button>
        <button
          className="absolute right-0.5 top-1/2 transform -translate-y-1/2 z-10 bg-white"
          onClick={() => handleArrowClick(1)}>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}

export default BannersScroll
