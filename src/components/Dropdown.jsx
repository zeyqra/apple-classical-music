import { useEffect, useRef, useState } from 'react'

const DropDown = ({ trigger, menu }) => {
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const [menuClass, setMenuClass] = useState('left-0')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const triggerEl = triggerRef.current
    const menuEl = menuRef.current

    if (!triggerEl || !menuEl) return

    const triggerRect = triggerEl.getBoundingClientRect()
    const triggerH = triggerEl.offsetHeight

    const menuW = menuEl.offsetWidth
    const viewportRight = document.documentElement.clientWidth
    setMenuClass(
      `${viewportRight - triggerRect.left < menuW ? 'right-0' : 'left-0'} top-[${triggerH}px]`
    )
    // setMenuStyle({ top: `${triggerH}px` })
  }, [isOpen])

  return (
    <div className="relative">
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      <div
        ref={menuRef}
        // style={menuStyle}
        className={`menu absolute ${menuClass} ${isOpen ? 'block' : 'hidden'}`}>
        {menu}
      </div>
    </div>
  )
}

export default DropDown
