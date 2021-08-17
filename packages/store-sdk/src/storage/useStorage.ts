/**
 * Safe IDB storage interface. These try..catch are usefull because
 * some browsers may block accesss to these APIs due to security policies
 *
 * Also, the stored value is lazy-loaded to avoid hydration mimatch
 * between server/browser. When state is 'hydrated', the value in the heap
 * is the same as the value in IDB
 */
import { useState, useEffect, useMemo } from 'react'
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

const isFunction = <T>(x: T | (() => T)): x is () => T =>
  typeof x === 'function'

export const useStorage = <T>(key: string, initialValue: T | (() => T)) => {
  const [data, setData] = useState(() => ({
    payload: isFunction(initialValue) ? initialValue() : initialValue,
    state: 'initial',
  }))

  useEffect(() => {
    let cancel = false

    const effect = async () => {
      if (data.state === 'initial') {
        const item = (await getItem<T>(key)) ?? data.payload

        if (!cancel) {
          setData({ payload: item, state: 'hydrated' })
        }
      } else {
        setItem(key, data.payload)
      }
    }

    effect()

    return () => {
      cancel = true
    }
  }, [data.payload, data.state, key])

  const memoized = useMemo(
    () =>
      [
        data.payload,
        (value: T) => setData({ state: 'hydrated', payload: value }),
      ] as const,
    [data.payload]
  )

  return memoized
}
