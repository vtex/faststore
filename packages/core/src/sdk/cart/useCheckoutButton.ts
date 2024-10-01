import storeConfig from '../../../discovery.config'
import { useCart } from './index'

export const useCheckoutButton = () => {
  const { isValidating, id } = useCart()

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const isDevEnv =
      window.location.host.includes('.vtex.app') ||
      window.location.host.includes('localhost')

    if (!isValidating) {
      if (!isDevEnv) {
        window.location.href = `${storeConfig.checkoutUrl}`
      } else if (id) {
        window.location.href = `${storeConfig.checkoutUrl}?orderFormId=${id}`
      }
    }
  }

  return {
    onClick,
    disabled: isValidating,
    'data-testid': 'checkout-button',
  }
}
