import { useContext } from 'react'

import { Context } from './Provider'

export const useRegion = () => {
  const context = useContext(Context)

  // if (context === undefined) {
  //   throw new Error('Region context provider missing from React tree')
  // }

  return context
}
