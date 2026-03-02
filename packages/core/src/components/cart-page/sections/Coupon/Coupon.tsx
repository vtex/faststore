import { Button, Icon, InputField, Tag } from '@faststore/ui'
import { useCallback, useState } from 'react'

import { useCartPage } from '../../context/CartPageContext'
import type { CouponUnion, Coupon as CouponType } from '../../context/types'

import styles from './Coupon.module.scss'

interface CouponProps {
  coupon: CouponUnion
}

export default function Coupon({ coupon }: CouponProps) {
  const { addPromoCode, removePromoCode, mutating } = useCartPage()
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const promoCodes =
    coupon.__typename === 'Coupon'
      ? (coupon as CouponType).promoCodes
      : []

  const hasPromoCodes = promoCodes.length > 0

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)

      if (!inputValue.trim()) return

      try {
        await addPromoCode(
          promoCodes.map((p) => p.value),
          inputValue.trim()
        )
        setInputValue('')
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Invalid promo code'
        )
      }
    },
    [addPromoCode, inputValue, promoCodes]
  )

  const handleRemove = useCallback(
    (promoCode: string) => {
      removePromoCode(
        promoCodes.map((p) => p.value),
        promoCode
      )
    },
    [removePromoCode, promoCodes]
  )

  return (
    <div className={styles.coupon} data-fs-cart-page-coupon>
      <button
        type="button"
        className={styles.couponToggle}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <Icon name="Tag" width={18} height={18} />
        <span>Promo Code</span>
        <Icon
          name={isExpanded ? 'CaretUp' : 'CaretDown'}
          width={16}
          height={16}
        />
      </button>

      {(isExpanded || hasPromoCodes) && (
        <div className={styles.couponContent}>
          <form onSubmit={handleSubmit} className={styles.couponForm}>
            <InputField
              id="cart-promo-code"
              label="Promo code"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setError(null)
              }}
              error={error}
              disabled={mutating}
            />
            <Button
              type="submit"
              variant="secondary"
              size="small"
              disabled={mutating || !inputValue.trim()}
            >
              Apply
            </Button>
          </form>

          {error && (
            <p className={styles.couponError}>{error}</p>
          )}

          {hasPromoCodes && (
            <div className={styles.couponList}>
              {promoCodes.map((promo) => (
                <Tag
                  key={promo.value}
                  variant={promo.isUnmatchedCondition ? 'warning' : 'info'}
                  label={promo.value}
                  onClose={() => handleRemove(promo.value)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
