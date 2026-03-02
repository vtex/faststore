import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import type {
  Summary,
  ShippingTotalizer,
  GiftCardTotalizer,
} from '../../context/types'

import styles from './CartPageSummary.module.scss'

interface CartPageSummaryProps {
  summary: Summary
}

function ShippingLine({ shipping }: { shipping: Summary['totalizers']['shipping'] }) {
  if (shipping.__typename === 'FreeShippingTotalizer') {
    return <span className={styles.summaryFreeShipping}>Free</span>
  }

  if (shipping.__typename === 'ToBeCalculatedShippingTotalizer') {
    return <span className={styles.summaryToBeCalculated}>To be calculated</span>
  }

  const totalizer = shipping as ShippingTotalizer

  return <span>{totalizer.value_v2.asCurrency}</span>
}

function GiftCardLine({ giftCard }: { giftCard: GiftCardTotalizer }) {
  return (
    <div className={styles.summaryGiftCards}>
      <span>
        Gift card{giftCard.count > 1 ? `s (${giftCard.count})` : ''}
      </span>
      <span>-{giftCard.total.asCurrency}</span>
    </div>
  )
}

export default function CartPageSummary({ summary }: CartPageSummaryProps) {
  const { totalizers, giftCardTotalizer, total } = summary
  const discountValue = totalizers.discounts_v2?.asNumber ?? 0
  const hasDiscount = discountValue > 0
  const formattedDiscount = useFormattedPrice(discountValue)

  return (
    <div className={styles.summary} data-fs-cart-page-summary>
      <h3 className={styles.summaryTitle}>Order Summary</h3>

      <div className={styles.summaryLines}>
        {totalizers.items && (
          <div className={styles.summaryLine}>
            <span>Subtotal</span>
            <span>{totalizers.items}</span>
          </div>
        )}

        <div className={styles.summaryLine}>
          <span>Shipping</span>
          <ShippingLine shipping={totalizers.shipping} />
        </div>

        {totalizers.customTax_v2 && (
          <div className={styles.summaryLine}>
            <span>Tax</span>
            <span>{totalizers.customTax_v2.asCurrency}</span>
          </div>
        )}

        {hasDiscount && (
          <div className={`${styles.summaryLine} ${styles.summaryDiscount}`}>
            <span>Discount</span>
            <span>-{formattedDiscount}</span>
          </div>
        )}

        {giftCardTotalizer && (
          <GiftCardLine giftCard={giftCardTotalizer} />
        )}
      </div>

      <div className={styles.summaryTotal}>
        <span>Total</span>
        <span>{total.asCurrency}</span>
      </div>
    </div>
  )
}
