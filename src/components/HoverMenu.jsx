import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const Hoverdown = ({ trigger, menu }) => {
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  // const [xy, setXy] = useState({ x: 0, y: 0 })
  const [menuStyle, setMenuStyle] = useState({})

  const handleMouseEnter = () => {
    setIsOpen(true)
  }
  const handleMouseLeave = () => {
    setIsOpen(false)
  }

  // 计算菜单定位
  useLayoutEffect(() => {
    if (!isOpen) return

    const triggerEl = triggerRef.current
    const menuEl = menuRef.current

    if (!triggerEl || !menuEl) return

    const triggerRect = triggerEl.getBoundingClientRect()
    const triggerLeft = triggerRect.left
    const triggerRight = triggerRect.right
    const triggerTop = triggerRect.top
    const triggerBottom = triggerRect.bottom
    const menuW = menuEl.offsetWidth
    const menuH = menuEl.offsetHeight
    const viewportRight = document.documentElement.clientWidth
    const viewportTop = document.documentElement.clientHeight
    setMenuStyle({
      left: `${viewportRight - triggerLeft < menuW ? `${triggerLeft - menuW}px` : `${triggerRight}px`}`,
      top: `${viewportTop - triggerBottom < menuH ? `${triggerBottom - menuH}px` : `${triggerTop}px`}`,
    })
  }, [isOpen])

  // // 点击外部，关闭菜单
  // const dropdownRef = useRef(null)
  // useEffect(() => {
  //   if (!isOpen) return

  //   const handleClickOutside = e => {
  //     if (!dropdownRef.current.contains(e.target)) {
  //       setIsOpen(false)
  //     }

  //     if (e.target.closest('.dropdown-menu')) {
  //       setIsOpen(false)
  //     }
  //   }

  //   document.addEventListener('click', handleClickOutside)
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside)
  //   }
  // }, [isOpen])

  return (
    <div className={`relative inline-block ${isOpen ? 'z-100' : ''}`}>
      {/* 触发按钮 */}
      <div ref={triggerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {trigger}
        {/* 菜单 */}
        <div
          ref={menuRef}
          style={menuStyle}
          className={`dropdown-menu bg-white cursor-default border border-zinc-500 fixed w-max whitespace-nowrap ${isOpen ? 'block' : 'hidden'}`}>
          {menu}
        </div>
      </div>
    </div>
  )
}

export default Hoverdown
