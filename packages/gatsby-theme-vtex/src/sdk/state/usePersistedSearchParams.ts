import { useEffect } from 'react'

import { isServer } from '../../utils/env'
import { useSearchParams } from './useSearchParams'

export const usePersistedSearchParams = (
  valueDefault: string,
  key: string
): [string, typeof setSearchParams] => {
  const [searchParams, setSearchParams] = useSearchParams()

  const value = isServer
    ? valueDefault
    : searchParams.get(key) ?? localStorage.getItem(key) ?? valueDefault

  useEffect(() => {
    localStorage.setItem(key, value)
  }, [value])

  return [value, setSearchParams]
}
