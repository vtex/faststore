import { useContext } from 'react'

import { SKUMatrixContext } from '../organisms/SKUMatrix/provider/SKUMatrixProvider'

export function useSKUMatrix() {
  const context = useContext(SKUMatrixContext)

  if (!context) {
    throw new Error(
      'Do not use SKUMatrix components outside the SKUMatrix context'
    )
  }

  return context
}
