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
        window.location.href = `/checkout`
      } else if (id) {
        window.location.href = `/checkout?orderFormId=${id}`
      }
    }
  }

  return {
    onClick,
    disabled: isValidating,
    'data-testid': 'checkout-button',
  }
}
