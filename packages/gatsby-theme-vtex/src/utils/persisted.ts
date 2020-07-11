import { useEffect } from 'react'

import { isServer } from './env'
import { useQuerystring } from './querystring'

export const usePersisted = (
  valueDefault: string,
  key: string
): [string, typeof setSearchParams] => {
  const [searchParams, setSearchParams] = useQuerystring()

  const value = isServer
    ? valueDefault
    : searchParams.get(key) ?? localStorage.getItem(key) ?? valueDefault

  useEffect(() => {
    localStorage.setItem(key, value)
  }, [value])

  return [value, setSearchParams]
}
