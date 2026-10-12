import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-999"
      onClick={onClose}>
      <div className="bg-white rounded relative inline-block" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 right-2 z-10" onClick={onClose}>
          <X />
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Dialog
