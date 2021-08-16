/**
 * Safe localstorage interface. These try..catch are usefull because
 * some browsers may block accesss to these APIs due to security policies
 *
 * Also, the local storage value is lazy-loaded to avoid hydration mimatch
 * between server/browser. When state is 'hydrated', the in the heap is the
 * same as the value in local storage
 */
import { useState, useEffect, useCallback } from 'react'

const getItem = <T>(key: string) => {
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? 'null') as T | null
  } catch (err) {
    return null
  }
}

const setItem = <T>(key: string, value: T | null) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    // noop
  }
}

const isFunction = <T>(x: T | (() => T)): x is () => T =>
  typeof x === 'function'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T | (() => T)
) => {
  const [data, setData] = useState(() => ({
    payload: isFunction(initialValue) ? initialValue() : initialValue,
    state: 'initial',
  }))

  useEffect(() => {
    if (data.state === 'inital') {
      const item = getItem<T>(key) ?? data.payload

      setData({ payload: item, state: 'hydrated' })
      setItem(key, item)
    } else {
      setItem(key, data.payload)
    }
  }, [data.payload, data.state, key])

  const setPayload = useCallback(
    (value: T) => setData((state) => ({ ...state, payload: value })),
    []
  )

  return [data.payload, setPayload] as [typeof data.payload, typeof setPayload]
}
