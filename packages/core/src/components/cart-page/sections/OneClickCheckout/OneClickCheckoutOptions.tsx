import { Button, Icon } from '@faststore/ui'

import type { OneClickCheckoutOptions as OneClickCheckoutOptionsType } from '../../context/types'

import styles from './OneClickCheckout.module.scss'

interface OneClickCheckoutOptionsProps {
  options: OneClickCheckoutOptionsType
}

export default function OneClickCheckoutOptions({
  options,
}: OneClickCheckoutOptionsProps) {
  const { applePay, googlePay } = options

  if (!applePay && !googlePay) return null

  return (
    <div className={styles.oneClickCheckout} data-fs-one-click-checkout>
      {applePay && (
        <Button
          className={styles.oneClickCheckoutButton}
          variant="secondary"
          icon={<Icon name="ApplePay" width={24} height={24} />}
          iconPosition="left"
          aria-label="Pay with Apple Pay"
          data-fs-apple-pay-button
        >
          Apple Pay
        </Button>
      )}
      {googlePay && (
        <Button
          className={styles.oneClickCheckoutButton}
          variant="secondary"
          icon={<Icon name="GooglePay" width={24} height={24} />}
          iconPosition="left"
          aria-label="Pay with Google Pay"
          data-fs-google-pay-button
        >
          Google Pay
        </Button>
      )}
    </div>
  )
}
