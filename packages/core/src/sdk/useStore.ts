import { createBaseStore } from '@faststore/sdk'
import { useSyncExternalStore } from 'react'
import type { Store } from '@faststore/sdk'

export const useStore = <T>(store: Store<T>) =>
  useSyncExternalStore(store.subscribe, store.read, store.readInitial)

type CB<T> = (val: T) => Promise<T | null>

export const createValidationStore = <T>(cb: CB<T>) => {
  const store = createBaseStore(false)

  const onValidate = async (val: T) => {
    try {
      store.set(true)

      return await cb(val)
    } finally {
      store.set(false)
    }
  }

  return [store, onValidate] as [Store<boolean>, CB<T>]
}
