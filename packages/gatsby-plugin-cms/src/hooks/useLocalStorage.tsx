import { useState, useEffect } from 'react'

import { CMS_CONTENT } from '../utils/constants'

// A hook that uses the local storage and updates when a
// storage updates
export const useLocalStorage = <T extends any>() => {
  const [storage, setStorage] = useState<T | null>(null)

  useEffect(() => {
    const item = JSON.parse(localStorage.getItem(CMS_CONTENT) ?? 'null')

    if (item !== storage) {
      setStorage(item)
    }
  }, [storage])

  useEffect(() => {
    const cb = () => {
      const oldStorage = JSON.stringify(storage)
      const newStorage = localStorage.getItem(CMS_CONTENT) ?? 'null'

      if (oldStorage !== newStorage) {
        const element = JSON.parse(newStorage)

        setStorage(element)
      }
    }

    window.addEventListener('storage', cb)

    return () => window.removeEventListener('storage', cb)
  }, [storage])

  return storage
}
