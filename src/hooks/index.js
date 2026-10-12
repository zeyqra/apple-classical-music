import { useEffect, useRef, useState } from 'react'

export const useDebounce = (val, delay) => {
  const [dbVa, setDbVa] = useState(val)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDbVa(val)
    }, delay)
    return () => clearTimeout(timer)
  }, [val, delay])
  return dbVa
}

export const useDebounceFn = (fn, delay) => {
  let timer = useRef(null)
  const debounceFn = function (...args) {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      fn(...args)
    }, delay)
  }
  return debounceFn
}
