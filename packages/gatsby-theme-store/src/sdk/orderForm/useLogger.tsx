import { useCallback } from 'react'

export const useLogger = () => {
  const log = useCallback(() => {}, [])

  return { log }
}
