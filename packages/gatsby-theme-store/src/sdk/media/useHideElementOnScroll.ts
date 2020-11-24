import { useCallback, useState } from 'react'

import useScroll from './useScroll'

function useHideElementOnScroll() {
  const [prevScrollPosition, setPrevScrollPosition] = useState<number>(0)
  const [hidden, setHidden] = useState<boolean>(false)

  const handleScroll = useCallback(() => {
    const currentScrollPosition = window.pageYOffset

    if (prevScrollPosition > currentScrollPosition) {
      setHidden(false)
    } else {
      setHidden(true)
    }

    setPrevScrollPosition(window.pageYOffset)
  }, [prevScrollPosition])

  useScroll(handleScroll)

  return { hidden }
}

export default useHideElementOnScroll
