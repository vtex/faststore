import { useContext } from 'react'

import { Context } from './Provider'

export const useToast = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('Toast must have a Toast Provider in the React tree')
  }

  return context
}
