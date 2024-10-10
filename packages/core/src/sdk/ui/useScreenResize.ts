import { useEffect, useState } from 'react'

const MAX_MOBILE_WIDTH = 420
const MAX_TABLET_WIDTH = 768
const MIN_NOTEBOOK_WIDTH = 1280

function useScreenResize() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MAX_MOBILE_WIDTH)
      setIsTablet(
        window.innerWidth > MAX_MOBILE_WIDTH &&
          window.innerWidth <= MAX_TABLET_WIDTH
      )
      setIsDesktop(window.innerWidth >= MIN_NOTEBOOK_WIDTH)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { isMobile, isTablet, isDesktop }
}

export default useScreenResize
