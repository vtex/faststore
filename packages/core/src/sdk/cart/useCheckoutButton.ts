import { useCart } from './index'
import { redirectToCheckout } from './redirectToCheckout'

export const useCheckoutButton = () => {
  const { isValidating, id } = useCart()

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!isValidating) {
      redirectToCheckout(id)
    }
  }

  return {
    onClick,
    disabled: isValidating,
    'data-testid': 'checkout-button',
  }
}
