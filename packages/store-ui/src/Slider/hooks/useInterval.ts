import { useEffect, useRef } from 'react'

export const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<() => void>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const handler = () => savedCallback?.current?.()

    if (delay !== null) {
      const id = setInterval(handler, delay)

      return () => clearInterval(id)
    }

    return () => {}
  }, [delay])
}
