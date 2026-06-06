import { createContext, useCallback, useContext, useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog'

const ConfirmContext = createContext(null)

const defaultOptions = {
  title: 'Are you sure?',
  description: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
}

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState({
    open: false,
    options: defaultOptions,
    resolve: null,
  })
  // const resolverRef = useRef(null)

  const confirm = options => {
    // const confirm = useCallback(options => {
    return new Promise(resolve => {
      // resolverRef.current = resolve
      setState({
        open: true,
        options: {
          ...defaultOptions,
          ...options,
        },
        resolve,
      })
    })
  }

  const settle = result => {
    // const settle = useCallback(result => {
    // if (resolverRef.current) {
    //   resolverRef.current(result)
    //   resolverRef.current = null
    // }

    state.resolve?.(result)

    setState(prev => ({
      ...prev,
      open: false,
      options: defaultOptions,
    }))
  }

  const handleConfirm = () => {
    settle(true)
  }

  const handleCancel = () => {
    settle(false)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <AlertDialog
        open={state.open}
        onOpenChange={open => {
          if (!open) handleCancel()
        }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state.options.title}</AlertDialogTitle>

            {state.options.description && (
              <AlertDialogDescription>{state.options.description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>{state.options.cancelText}</AlertDialogCancel>

            <AlertDialogAction onClick={handleConfirm}>
              {state.options.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  )
}

export const useConfirm = () => {
  const context = useContext(ConfirmContext)

  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider')
  }

  return context
}
