import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const Dropdown = ({ trigger, menu }) => {
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [xy, setXy] = useState({ x: 0, y: 0 })
  const [menuStyle, setMenuStyle] = useState({})

  const handleTriggerClick = e => {
    setXy({ x: e.clientX, y: e.clientY })
    setIsOpen(prev => !prev)
  }

  // 计算菜单定位
  useLayoutEffect(() => {
    if (!isOpen) return

    const triggerEl = triggerRef.current
    const menuEl = menuRef.current

    if (!triggerEl || !menuEl) return

    const menuW = menuEl.offsetWidth
    const menuH = menuEl.offsetHeight
    const viewportRight = document.documentElement.clientWidth
    const viewportTop = document.documentElement.clientHeight
    setMenuStyle({
      left: `${viewportRight - xy.x < menuW ? `${xy.x - menuW - 4}px` : `${xy.x + 4}px`}`,
      top: `${viewportTop - xy.y < menuH ? `${xy.y - menuH - 4}px` : `${xy.y + 4}px`}`,
    })
  }, [isOpen])

  // 点击外部，关闭菜单
  const dropdownRef = useRef(null)
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = e => {
      if (!dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }

      console.log('console: ', e.target.className)
      if (e.target.closest('.dropdown-menu')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className={`relative inline-block ${isOpen ? 'z-100' : ''}`}>
      {/* 触发按钮 */}
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {trigger}
      </div>
      {/* 菜单 */}
      <div
        ref={menuRef}
        style={menuStyle}
        className={`text-sm dropdown-menu bg-white cursor-default border border-zinc-500 fixed w-max whitespace-nowrap ${isOpen ? 'block' : 'hidden'}`}>
        {menu}
      </div>
    </div>
  )
}

export default Dropdown
