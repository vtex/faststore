import { create } from 'zustand'
import type { StoreApi, UseBoundStore } from 'zustand'
import type { State } from '../types'
import { parse } from './serializer'
import format from '../utils/format'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}
export const initialize = ({
  sort = null,
  selectedFacets = [],
  term = null,
  base = '',
  page = null,
  passThrough = new URLSearchParams(),
  itemsPerPage = null,
}: Partial<State> | undefined = {}) => ({
  sort,
  selectedFacets,
  term,
  base,
  page,
  passThrough,
  itemsPerPage,
})

type TransformKeys<Object extends object> = {
  [k in keyof Object as `set${Capitalize<string & k>}`]: (
    val: Object[k]
  ) => void
}

export type UseSearchState = State &
  TransformKeys<State> & {
    parseURL: (url: URL) => void
    serializedState: () => URL
    initialized: boolean
    start: (asPath: string, initialState: Partial<State>) => void
    setState: (state: Partial<State>) => void
  }

const stateBase = create<UseSearchState>((set, get) => ({
  ...initialize(),
  setSort: (sort) => set({ sort }),
  setSelectedFacets: (selectedFacets) => set({ selectedFacets }),
  setTerm: (term) => set({ term }),
  setBase: (base) => set({ base }),
  setPage: (page) => set({ page }),
  setPassThrough: (passThrough) => set({ passThrough }),
  setItemsPerPage: (itemsPerPage) => ({ itemsPerPage }),
  setState: (state: Partial<State>) =>
    set((currentState) => ({ ...currentState, ...state })),
  parseURL: (url: URL) => {
    const newState = parse(url)
    const oldState = format(get())

    if (format(newState).href !== oldState.href) {
      set(newState)
    }
  },
  serializedState: () => format(get()),
  initialized: false,
  start: (asPath: string, state: Partial<State>) => {
    if (!get().initialized) {
      set({
        initialized: true,
        ...state,
        ...parse(new URL(asPath, 'http://localhost')),
      })
    }
  },
}))

export const useSearchState = createSelectors(stateBase)
