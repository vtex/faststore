import { useEffect, useState } from 'react'

/**
 * Hook to detect if the document is in RTL (Right-to-Left) direction.
 * @returns true if the document direction is RTL, false otherwise
 */
export const useRTL = (): boolean => {
  const [isRTL, setIsRTL] = useState(false)

  useEffect(() => {
    const checkRTL = () => {
      if (typeof window === 'undefined') {
        return false
      }

      const dir = document.documentElement.dir || document.body.dir || 'ltr'
      return dir === 'rtl'
    }

    setIsRTL(checkRTL())

    // Watch for changes in the dir attribute
    const observer = new MutationObserver(() => {
      setIsRTL(checkRTL())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir'],
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['dir'],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return isRTL
}
