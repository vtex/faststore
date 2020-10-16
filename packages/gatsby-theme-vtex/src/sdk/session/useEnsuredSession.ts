import { useMemo } from 'react'

import { useSession } from './useSession'

export const useEnsuredSession = () => {
  const { value, dispatch } = useSession()

  const promise = useMemo(() => {
    if (!value) {
      return dispatch({ type: 'create' })
    }
  }, [dispatch, value])

  if (typeof promise?.then === 'function') {
    throw promise
  }

  return { value, dispatch }
}
