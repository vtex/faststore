import { useLink } from 'src/sdk/ui/useLink'

import storeConfig from '../../../discovery.config'
import { useCart } from './index'
import { redirectToCheckout } from './redirectToCheckout'

export const useCheckoutButton = () => {
  const { isValidating, id } = useCart()
  const { resolveLink } = useLink()
  const resolvedCheckoutUrl =
    resolveLink(storeConfig.checkoutUrl) ?? storeConfig.checkoutUrl

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!isValidating) {
      redirectToCheckout(id, resolvedCheckoutUrl)
    }
  }

  return {
    onClick,
    disabled: isValidating,
    'data-testid': 'checkout-button',
  }
}
