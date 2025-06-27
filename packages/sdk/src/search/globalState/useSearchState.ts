import { create } from 'zustand'
import type { Facet, State } from '../../types'
import { parse } from '../serializer'
import format from '../../utils/format'
import { withSelectors } from '../../utils/withSelectors'
import deepEquals from 'fast-deep-equal'

export const initialize = ({
  sort = 'score_desc',
  selectedFacets = [],
  term = null,
  base = '/',
  page = 0,
  passThrough = new URLSearchParams(),
}: Partial<State> | undefined = {}) => ({
  sort,
  selectedFacets,
  term,
  base,
  page,
  passThrough,
})

export type UseSearchState = {
  state: State
  setState: (state: Partial<State>) => void
  appendFacet: (facets: Facet[]) => void
  itemsPerPage: number
  setItemsPerPage: (itemsPerPage: number) => void
  serializedState: () => URL
  parseURL: (url: URL) => void
  pages: number[]
  addPrevPage: () => void
  addNextPage: () => void
  resetInfiniteScroll: (page: number) => void
  reset: () => void
  initialized: boolean
  start: (
    asPath: string,
    initialState: Partial<
      State & Pick<UseSearchState, 'itemsPerPage' | 'pages'>
    >
  ) => void
}

const stateBase = create<UseSearchState>((set, get) => ({
  state: initialize(),
  setState: (state: Partial<State>) => {
    const oldState = get().state
    const newState = { ...oldState, ...state }
    if (deepEquals(oldState, newState) === false) set({ state: newState })
  },
  appendFacet: (facets: Facet[]) =>
    set((curr) => ({
      state: {
        ...curr.state,
        selectedFacets: [
          // remove repeated
          ...curr.state.selectedFacets.filter(
            (sf) => !facets.some((facet) => facet.key === sf.key)
          ),
          ...facets,
        ],
      },
    })),

  itemsPerPage: 0,
  setItemsPerPage: (itemsPerPage: number) => set({ itemsPerPage }),

  pages: getPagesFromSessionStorage() ?? [0],
  addPrevPage: () => {
    const { pages } = get()
    const prev = pages[0] - 1
    const newState = [prev, ...pages]
    setPagesSessionStorage(newState)
    set({ pages: newState })
  },
  addNextPage: () => {
    const { pages } = get()
    const next = Number(pages.at(-1)) + 1
    const newState = [...pages, next]
    setPagesSessionStorage(newState)
    set({ pages: newState })
  },
  resetInfiniteScroll: (page: number) => {
    const newState = [page]
    setPagesSessionStorage(newState)
    set({ pages: newState })
  },

  parseURL: (url: URL) => {
    const newState = parse(url)
    const oldState = format(get().state)

    if (format(newState).href !== oldState.href) {
      set({ state: newState })
    }
  },
  serializedState: () => format(get().state),
  initialized: false,
  reset: () => {
    set({ state: initialize() })
  },
  start: (
    asPath: string,
    state: Partial<State & Pick<UseSearchState, 'itemsPerPage' | 'pages'>>
  ) => {
    if (!get().initialized) {
      set((prev) => ({
        initialized: true,
        state: initialize({
          ...prev.state,
          ...state,
          ...parse(new URL(asPath, 'http://localhost')),
        }),
        itemsPerPage: state.itemsPerPage ?? prev.itemsPerPage,
        pages: state.pages ?? prev.pages,
      }))
    }
  },
}))

export const useSearchState = withSelectors(stateBase)

const getSessionStorageKey = (key: string) => `__fs_gallery_page_${key}`

function getPagesFromSessionStorage(): number[] | null {
  try {
    const stateKey = window.history.state?.key
    if (!stateKey) {
      return null
    }
    const storageKey = getSessionStorageKey(stateKey)

    const item = sessionStorage.getItem(storageKey)

    return item ? JSON.parse(item) : null
  } catch (_) {
    return null
  }
}

function setPagesSessionStorage(pages: number[]) {
  try {
    // Uses the key to identify a PLP
    const stateKey = window.history.state?.key
    if (!stateKey) {
      return
    }
    const storageKey = getSessionStorageKey(stateKey)

    sessionStorage.setItem(storageKey, JSON.stringify(pages))
  } catch (_) {
    return
  }
}
