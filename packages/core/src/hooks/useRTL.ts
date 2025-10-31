import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'faststore-rtl-direction'
const RTL_VALUE = 'rtl'
const LTR_VALUE = 'ltr'

/**
 * Hook to manage RTL/LTR direction toggle
 */
export function useRTL() {
  const [direction, setDirectionState] = useState<'rtl' | 'ltr'>(() => {
    // Initialize from localStorage or default to LTR
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === RTL_VALUE || saved === LTR_VALUE) {
        return saved as 'rtl' | 'ltr'
      }
    }
    return LTR_VALUE as 'rtl' | 'ltr'
  })

  // Update HTML dir attribute when direction changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', direction)
    }
  }, [direction])

  // Save to localStorage when direction changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, direction)
    }
  }, [direction])

  const toggleDirection = useCallback(() => {
    setDirectionState((prev) => (prev === RTL_VALUE ? LTR_VALUE : RTL_VALUE))
  }, [])

  const setDirection = useCallback((dir: 'rtl' | 'ltr') => {
    setDirectionState(dir)
  }, [])

  const isRTL = direction === RTL_VALUE

  return {
    direction,
    isRTL,
    toggleDirection,
    setDirection,
  }
}
