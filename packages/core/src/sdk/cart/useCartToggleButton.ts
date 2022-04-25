import { useCallback } from 'react'

import { useUI } from '../ui'
import { useCart } from './useCart'

export const useCartToggleButton = () => {
  const { totalItems } = useCart()
  const { displayMinicart, openMinicart, closeMinicart } = useUI()

  const onClick = useCallback(() => {
    if (displayMinicart) {
      closeMinicart()
    } else {
      openMinicart()
    }
  }, [closeMinicart, displayMinicart, openMinicart])

  return {
    onClick,
    'data-testid': 'cart-toggle',
    'data-items': totalItems,
  }
}
