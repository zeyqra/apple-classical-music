import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HorizenScroll = ({
  title,
  titlePath,
  list,
  renderItem,
  itemMinWidth = 180,
  loading = true,
}) => {
  const itemsContainer = useRef()
  const itemsInner = useRef(null)
  const handleArrowClick = direction => {
    itemsContainer.current.scrollBy({
      left: itemsContainer.current.offsetWidth * direction,
      behavior: 'smooth',
    })
  }

  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  useEffect(() => {
    const container = itemsContainer.current
    if (!container) return

    const handleScroll = () => {
      setCanLeft(container.scrollLeft > 0)
      setCanRight(container.scrollLeft + container.offsetWidth < container.scrollWidth)
    }
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const navigate = useNavigate()

  const handleTitleClick = () => {
    if (!titlePath) return
    navigate(titlePath)
  }

  const [itemWidth, setItemWidth] = useState(itemMinWidth)
  useLayoutEffect(() => {
    const container = itemsContainer.current
    if (!container) return

    const updateWidth = () => {
      const count = Math.max(1, Math.floor(container.offsetWidth / itemMinWidth))
      setItemWidth(`calc(${100 / count}% - 0.25rem)`)
    }

    const observer = new ResizeObserver(updateWidth)
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  // if (loading) return <div style={{ height: `calc(3rem + 180px)` }} className="bg-zinc-200"></div>

  return (
    <div className="HorizenScroll relative">
      <div className="absolute right-0 top-0 z-50">
        <button
          className="bg-white border border-zinc-300 disabled:opacity-20"
          disabled={!canLeft}
          onClick={() => handleArrowClick(-1)}>
          <ChevronLeft />
        </button>
        <button
          className="bg-white border border-zinc-300 disabled:opacity-20"
          disabled={!canRight}
          onClick={() => handleArrowClick(1)}>
          <ChevronRight />
        </button>
      </div>
      {title && (
        <h2 className="">
          <span className="inline-flex items-center text-lg mb-1" onClick={handleTitleClick}>
            {title}
            {titlePath && <ChevronRight size={15} className="inline-block" />}
          </span>
        </h2>
      )}
      <div className="relative">
        <div ref={itemsContainer} style={{ width: 'calc(100%)' }} className="flex overflow-hidden ">
          {list.map(item => renderItem(item, { width: itemWidth, minWidth: 180 }))}
        </div>
      </div>
    </div>
  )
}

export default HorizenScroll
