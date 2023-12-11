import storeConfig from '../../../faststore.config'
import { useCart } from './index'

export const useCheckoutButton = () => {
  const { isValidating } = useCart()

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!isValidating) {
      window.location.href = `${storeConfig.checkoutUrl}`
    }
  }

  return {
    onClick,
    disabled: isValidating,
    'data-testid': 'checkout-button',
  }
}
