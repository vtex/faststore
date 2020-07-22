import { useState, useEffect } from 'react'

import { isServer } from '../../utils/env'

const getItem = (key: string) => {
  const item = localStorage.getItem(key)

  return item ? JSON.parse(item) : item
}

// A hook that uses the local storage and updates when a
// storage updates
export const useLocalStorage = <T extends any>(key: string) => {
  const [storage, setStorage] = useState<T | null>(() =>
    isServer ? null : getItem(key)
  )

  useEffect(() => {
    window.addEventListener('storage', () => {
      const oldStorage = JSON.stringify(storage)
      const newStorage = localStorage.getItem(key)

      if (oldStorage !== newStorage) {
        const element = newStorage && JSON.parse(newStorage)

        setStorage(element)
      }
    })
  }, [key, storage])

  return storage
}
