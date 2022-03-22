/**
 * Safe IDB storage interface. These try..catch are useful because
 * some browsers may block access to these APIs due to security policies
 *
 * Also, the stored value is lazy-loaded to avoid hydration mismatch
 * between server/browser. When state is 'hydrated', the value in the heap
 * is the same as the value in IDB
 */
import { useState, useEffect } from 'react'
import { get, set } from 'idb-keyval'

const getItem = async <T>(key: string) => {
  try {
    const value = await get<T>(key)

    return value ?? null
  } catch (err) {
    return null
  }
}

const setItem = async <T>(key: string, value: T | null) => {
  try {
    await set(key, value)
  } catch (err) {
    // noop
  }
}

export const useStorage = <T>(key: string, initialValue: T | (() => T)) => {
  const [init] = useState(initialValue)
  const [data, setData] = useState(init)

  useEffect(() => {
    // Avoids race condition between this and next effect hook.
    if (data !== init) {
      setItem(key, data)
    }
  }, [data, init, key])

  useEffect(() => {
    let cancel = false

    const effect = async () => {
      const item = await getItem<T>(key)

      if (!cancel && item !== null) {
        setData(item)
      }
    }

    effect()

    return () => {
      cancel = true
    }
  }, [key])

  return [data, setData] as const
}
