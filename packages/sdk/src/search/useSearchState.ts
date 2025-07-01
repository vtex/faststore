import { useEffect } from 'react'
import {
  useSearchState as useGlobalSearchState,
  type UseSearchState as GlobalUseSearchState,
} from './globalState/useSearchState'

export { initialize } from './globalState/useSearchState'

export function useSearchState(
  initialState: Partial<GlobalUseSearchState['state']>,
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

export type UseSearchState = ReturnType<typeof useSearchState>
