import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ScrollList = ({ title, titlePath, list, renderItem }) => {
  const itemsContainer = useRef()
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

  const itemMinWidth = 180
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

  return (
    <div className="ScrollList relative">
      <div className="absolute right-0 top-0 z-50">
        <button
          className="bg-white border border-zinc-300 disabled:opacity-20"
          disabled={!canLeft}
          onClick={() => handleArrowClick(-1)}>
          ⬅
        </button>
        <button
          className="bg-white border border-zinc-300 disabled:opacity-20"
          disabled={!canRight}
          onClick={() => handleArrowClick(1)}>
          ➡
        </button>
      </div>
      {title && (
        <h2 className="">
          <span className="inline-flex items-center text-lg mb-1" onClick={handleTitleClick}>
            {title}
            {titlePath && '➡'}
          </span>
        </h2>
      )}
      <div className="relative">
        <div ref={itemsContainer} style={{ width: 'calc(100%)' }} className="flex overflow-hidden ">
          {list.map(item => (
            <div className="shrink-0 mx-0.5" style={{ width: itemWidth, minWidth: 180 }}>
              {renderItem(item, { width: itemWidth, minWidth: 180 })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ScrollList
