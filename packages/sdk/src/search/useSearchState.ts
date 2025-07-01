import { useEffect } from 'react'
import {
  useSearchState as useGlobalSearchState,
  type UseSearchState,
} from './globalState/useSearchState'

export function useSearchState(
  initialState: Partial<UseSearchState['state']>,
  onChange?: (url: URL) => void
) {
  const { state, setState, serializedState } = useGlobalSearchState()

  useEffect(() => {
    setState(initialState)
  }, [initialState])

  useEffect(() => {
    return useGlobalSearchState.subscribe(() => onChange?.(serializedState()))
  }, [])

  return { state, setState }
}
