import { useRef } from 'react'

const useDebounce = (fn, delay) => {
  let timer = useRef(null)
  const debounceFn = function (...args) {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      fn(...args)
    }, delay)
  }
  return debounceFn
}

export default useDebounce
