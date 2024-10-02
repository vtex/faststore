import { useEffect, useState } from 'react'

function useScreenResize() {
  const MAX_MOBILE_WIDTH = 412
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.innerWidth <= MAX_MOBILE_WIDTH)

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}

export default useScreenResize
