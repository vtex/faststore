import { useCallback } from 'react'

import storeConfig from '../../../../discovery.config'
import styles from './cart-page.module.scss'

interface CartActionButtonProps {
  disabled?: boolean
  label?: string
}

function CartActionButton({
  disabled = false,
  label = 'Continue to Checkout',
}: CartActionButtonProps) {
  const handleClick = useCallback(() => {
    window.location.href = storeConfig.checkoutUrl
  }, [])

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={styles.checkoutButton}
      data-fs-cart-action-button
      style={{
        padding: '0.875rem 1.5rem',
        background: disabled ? '#ccc' : 'var(--fs-color-primary-bkg, #2953b2)',
        color: '#fff',
        border: 'none',
        borderRadius: '0.25rem',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {label}
    </button>
  )
}

export default CartActionButton
