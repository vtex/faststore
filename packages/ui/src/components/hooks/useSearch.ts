import { useContext } from 'react'

import { SearchContext } from '../molecules/SearchProvider/SearchProvider'

export const useSearch = () => {
  const context = useContext(SearchContext)

  if (!context) {
    return { inContext: false as const }
  }

  return { inContext: true as const, values: context }
}
