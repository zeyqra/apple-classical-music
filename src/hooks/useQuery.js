import { useEffect, useState } from 'react'

export const useQuery = (queryFn, params) => {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await queryFn(params, { signal: controller.signal })

        setResult(result)
      } catch (error) {
        // !response.ok 时
        if (error.name === 'AbortError') return
        setError(error)
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [queryFn, params])

  return { result, isLoading, error }
}
