import { useEffect, useState } from 'react'

export default function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<string>('')

  useEffect(() => {
    let lastScrollY = window.scrollY

    const updateScrollDirection = () => {
      const { scrollY } = window
      const direction = scrollY > lastScrollY ? 'down' : 'up'

      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction)
      }

      lastScrollY = scrollY > 0 ? scrollY : 0
    }

    window.addEventListener('scroll', updateScrollDirection)

    return () => window.removeEventListener('scroll', updateScrollDirection)
  }, [scrollDirection])

  return scrollDirection
}
