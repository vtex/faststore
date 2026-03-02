import { Button, Icon } from '@faststore/ui'
import { useCallback } from 'react'

import storeConfig from '../../../../../discovery.config'
import type { Summary, OneClickCheckoutOptions } from '../../context/types'
import OneClickCheckoutOptionsComponent from '../OneClickCheckout/OneClickCheckoutOptions'

import styles from './CartActionMobile.module.scss'

interface CartActionMobileProps {
  summary: Summary | null
  disabled?: boolean
  oneClickCheckoutOptions?: OneClickCheckoutOptions | null
}

export default function CartActionMobile({
  summary,
  disabled = false,
  oneClickCheckoutOptions,
}: CartActionMobileProps) {
  const handleCheckout = useCallback(() => {
    window.location.href = (storeConfig as Record<string, string>).checkoutUrl ?? '/checkout'
  }, [])

  return (
    <div className={styles.cartActionMobile} data-fs-cart-action-mobile>
      {summary && (
        <div className={styles.cartActionMobileSummary}>
          <span className={styles.cartActionMobileLabel}>Total</span>
          <span className={styles.cartActionMobileTotal}>
            {summary.total.asCurrency}
          </span>
        </div>
      )}
      <div className={styles.cartActionMobileButtons}>
        <Button
          className={styles.cartActionMobileButton}
          variant="primary"
          onClick={handleCheckout}
          disabled={disabled}
          icon={<Icon name="ArrowRight" width={18} height={18} />}
          iconPosition="right"
        >
          Checkout
        </Button>
        {oneClickCheckoutOptions && (
          <OneClickCheckoutOptionsComponent options={oneClickCheckoutOptions} />
        )}
      </div>
    </div>
  )
}
