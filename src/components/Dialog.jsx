import { createPortal } from 'react-dom'

const Dialog = ({ isOpen, onClose, children }) => {
  const handleMuskClick = () => {
    onClose()
  }

  if (!isOpen) return null
  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-999"
      onClick={handleMuskClick}>
      <div className="bg-white relative" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Dialog
