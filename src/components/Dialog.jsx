const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-2 relative">
        <button className="absolute top-2 right-2" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  )
}

export default Dialog
