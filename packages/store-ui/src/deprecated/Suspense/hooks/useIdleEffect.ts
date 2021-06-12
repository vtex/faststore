/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import type { DependencyList, EffectCallback } from 'react'

export const useIdleEffect = (
  effect: EffectCallback,
  deps?: DependencyList | undefined
): void =>
  useEffect(() => {
    const id = window.requestIdleCallback(effect)

    return () => window.cancelIdleCallback(id)
  }, deps)
