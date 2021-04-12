import { useState } from 'react'

import { useIdleEffect } from '../useIdleEffect'

type SearchFn = (term: string) => Promise<void>

const noop = async (_: string) => {
  throw new Error('Cannot create full text search. Search is not ready')
}

export const useSearch = () => {
  const [search, setSearch] = useState<SearchFn>(() => noop)

  useIdleEffect(() => {
    import('./controller').then((controller) => {
      if (search === noop) {
        setSearch(() => controller.search)
      }
    })
  })

  return search
}
