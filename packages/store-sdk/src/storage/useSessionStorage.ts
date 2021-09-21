/**
 * Safe SessionStorage interface. These try..catch are usefull because
 * some browsers may block accesss to these APIs due to security policies
 *
 */
import { useState, useEffect } from 'react'

import { isFunction } from './utils'

const getItem = <T>(key: string): T | null => {
  try {
    const value = window.sessionStorage.getItem(key)

    return value && JSON.parse(value)
  } catch (err) {
    return null
  }
}

const setItem = <T>(key: string, value: T | null) => {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    // noop
  }
}

export const useSessionStorage = <T>(
  key: string,
  initialValue: T | (() => T)
) => {
  const state = useState(
    () =>
      getItem<T>(key) ??
      (isFunction(initialValue) ? initialValue() : initialValue)
  )

  const [data] = state

  useEffect(() => {
    setItem(key, data)
  }, [key, data])

  return state
}
