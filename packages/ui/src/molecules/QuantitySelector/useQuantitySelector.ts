import type { MouseEventHandler } from 'react'
import { createContext, useContext } from 'react'

export interface QuantitySelectorContext {
  /**
   * Name to link children by context.
   */
  name: string
  /**
   * Value of the quantity selector.
   */
  currentValue?: string | number
  /**
   * Function that is triggered when any children is clicked.
   */
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const QuantitySelectorContext = createContext<
  QuantitySelectorContext | undefined
>(undefined)

export function useQuantitySelector() {
  const context = useContext(QuantitySelectorContext)

  if (!context) {
    throw new Error(
      `useQuantitySelector hook cannot be used outside the QuantitySelector context`
    )
  }

  return context
}
