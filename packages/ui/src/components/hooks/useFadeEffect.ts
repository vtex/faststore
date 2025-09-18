import { useState, useCallback, useEffect } from 'react'

export const useFadeEffect = () => {
  const [fade, setFade] = useState<'in' | 'out'>('out')
  const fadeOut = useCallback(() => setFade('out'), [])
  const fadeIn = useCallback(() => setFade('in'), [])

  useEffect(() => {
    fadeIn()

    return () => {
      fadeOut()
    }
  }, [fadeIn, fadeOut])

  return {
    fade,
    fadeIn,
    fadeOut,
  }
}
