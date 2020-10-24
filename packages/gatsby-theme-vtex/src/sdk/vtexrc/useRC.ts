import { useEffect } from 'react'

export const useRC = (...args: any[]) => {
  useEffect(() => {
    window.vtexrca!(args)
  }, [])
}
