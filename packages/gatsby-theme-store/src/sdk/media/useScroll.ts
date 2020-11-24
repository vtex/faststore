import { useEffect } from 'react'

function useScroll(cb: (e: any) => void) {
  useEffect(() => {
    window.addEventListener('scroll', cb)

    return () => {
      window.removeEventListener('scroll', cb)
    }
  }, [cb])
}

export default useScroll
