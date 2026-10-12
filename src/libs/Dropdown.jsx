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

  useLayoutEffect(() => {
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
    // setMenuClass(
    //   `${viewportRight - xy.x < menuW ? `left-[${xy.x - menuW}px]` : `left-[${xy.x}px]`} ${viewportTop - xy.y < menuH ? `top-[${xy.y - menuH}px]` : `top-[${xy.y}px]`}`
    // )
    // setMenuStyle({ top: `${triggerH}px` })
  }, [isOpen])

  const dropdownRef = useRef(null)
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = e => {
      if (!dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className={`relative ${isOpen ? 'z-100' : ''}`}>
      <div ref={triggerRef} onClick={handleTriggerClick} className="DropdownTrigger">
        {trigger}
      </div>
      <div
        ref={menuRef}
        style={menuStyle}
        className={`text-sm menu cursor-default border border-zinc-300 fixed w-max whitespace-nowrap ${isOpen ? 'block' : 'hidden'}`}>
        {menu}
      </div>
    </div>
  )
}

export default Dropdown
