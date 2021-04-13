import { useContext } from 'react'

import { SearchBarContext } from './Provider'

export const useSearchBarContext = () => {
  const context = useContext(SearchBarContext)

  if (typeof context === 'undefined') {
    throw new Error('SearchBar context not found on the react tree')
  }

  return context
}
