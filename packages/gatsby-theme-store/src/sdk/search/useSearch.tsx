import { useContext } from 'react'

import { Context } from './Provider'

export const useSearch = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('SearchContext not found in React tree')
  }

  return context
}
