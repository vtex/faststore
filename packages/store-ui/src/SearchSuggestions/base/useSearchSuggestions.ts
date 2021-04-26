import { useContext } from 'react'

import { Context } from './Provider'

export const useSearchSuggestions = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('Search Suggestions provider needs to be on the React Tree')
  }

  return context
}
