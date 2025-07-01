import { useSearchState as useGlobalSearchState } from './globalState/useSearchState'

export function useSearchState() {
  const { state, setState } = useGlobalSearchState()

  return { state, setState }
}
