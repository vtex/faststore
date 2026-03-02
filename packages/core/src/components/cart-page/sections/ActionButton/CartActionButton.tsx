import { Button, Icon } from '@faststore/ui'
import { useCallback } from 'react'

import storeConfig from '../../../../../discovery.config'

import styles from './CartActionButton.module.scss'

interface CartActionButtonProps {
  disabled?: boolean
}

export default function CartActionButton({
  disabled = false,
}: CartActionButtonProps) {
  const handleCheckout = useCallback(() => {
    window.location.href = (storeConfig as Record<string, string>).checkoutUrl ?? '/checkout'
  }, [])

  return (
    <Button
      className={styles.cartActionButton}
      variant="primary"
      onClick={handleCheckout}
      disabled={disabled}
      icon={<Icon name="ArrowRight" width={18} height={18} />}
      iconPosition="right"
      data-fs-cart-action-button
    >
      Proceed to Checkout
    </Button>
  )
}
