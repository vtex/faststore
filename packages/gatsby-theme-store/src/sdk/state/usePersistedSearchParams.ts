import { useEffect } from 'react'

import { isServer } from '../../utils/env'
import { useSearchParams } from './useSearchParams'

export const usePersistedSearchParams = (
  valueDefault: string,
  key: string
): [string, typeof setSearchParams] => {
  const [searchParams, setSearchParams] = useSearchParams()

  let value = valueDefault

  if (!isServer) {
    value = searchParams.get(key) ?? valueDefault

    if (value === null && navigator.cookieEnabled) {
      value = localStorage.getItem(key) ?? valueDefault
    }
  }

  useEffect(() => {
    if (navigator.cookieEnabled) {
      localStorage.setItem(key, value)
    }
  }, [key, value])

  return [value, setSearchParams]
}
