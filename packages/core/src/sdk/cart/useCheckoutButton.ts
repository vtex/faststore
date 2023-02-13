import storeConfig from '../../../faststore.config'
import { useCart } from './index'

export const useCheckoutButton = () => {
  const { isValidating, id } = useCart()

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!isValidating && id) {
      window.location.href = `${storeConfig.checkoutUrl}?orderFormId=${id}`
    }
  }

  return {
    onClick,
    disabled: isValidating,
    'data-testid': 'checkout-button',
  }
}
