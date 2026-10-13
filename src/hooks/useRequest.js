import { useEffect, useState } from 'react'
import { request } from '../services/request'

export const useRequest = ({ path, payload, options }) => {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await request(path, {
          ...(options || {}),
          payload,
          signal: controller.signal,
        })

        setResult(result)
      } catch (error) {
        // !response.ok 时
        if (error.name === 'AbortError') return
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [path, payload, options])

  return { result, isLoading, error }
}
