const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        {children}
      </div>
    </div>
  )
}

export default Dialog
