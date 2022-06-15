import { useMemo } from 'react'

import format from '../utils/format'
import type { State } from '../types'

export const initialize = ({
  sort = 'score_desc',
  selectedFacets = [],
  term = null,
  base = '/',
  page = 0,
}: Partial<State> | undefined = {}) => ({
  sort,
  selectedFacets,
  term,
  base: base.endsWith('/') ? base : `${base}/`,
  page,
})

const equals = (s1: State, s2: State) => format(s1).href === format(s2).href

export const useSearchState = (
  initialState: Partial<State>,
  onChange: (url: URL) => void
) => {
  const state = useMemo(() => initialize(initialState), [initialState])

  return useMemo(
    () => ({
      state,
      setState: (newState: State) =>
        !equals(newState, state) && onChange(format(newState)),
    }),
    [onChange, state]
  )
}

export type UseSearchState = ReturnType<typeof useSearchState>
