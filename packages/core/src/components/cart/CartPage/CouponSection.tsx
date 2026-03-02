import { useCallback, useState } from 'react'

import styles from './cart-page.module.scss'

interface CouponSectionProps {
  appliedCoupons: string[]
  onAddCoupon: (code: string) => Promise<any>
  onRemoveCoupon: (code: string) => Promise<any>
}

function CouponSection({
  appliedCoupons,
  onAddCoupon,
  onRemoveCoupon,
}: CouponSectionProps) {
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = code.trim()
      if (!trimmed) return

      setIsSubmitting(true)
      setErrorMessage('')

      try {
        await onAddCoupon(trimmed)
        setCode('')
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to apply coupon'
        )
      } finally {
        setIsSubmitting(false)
      }
    },
    [code, onAddCoupon]
  )

  const handleRemove = useCallback(
    async (coupon: string) => {
      try {
        await onRemoveCoupon(coupon)
      } catch {
        // Silently fail — SWR will revalidate
      }
    },
    [onRemoveCoupon]
  )

  return (
    <div className={styles.couponSection} data-fs-coupon-section>
      <h3 className={styles.couponTitle}>Promo Code</h3>

      <form onSubmit={handleSubmit} className={styles.couponForm}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter promo code"
          disabled={isSubmitting}
          className={styles.couponInput}
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #e0e0e0',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
          }}
        />
        <button
          type="submit"
          disabled={isSubmitting || !code.trim()}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #e0e0e0',
            borderRadius: '0.25rem',
            background: 'var(--fs-color-primary-bkg, #2953b2)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '0.875rem',
            whiteSpace: 'nowrap',
          }}
        >
          {isSubmitting ? 'Applying...' : 'Apply'}
        </button>
      </form>

      {errorMessage && (
        <p
          style={{
            color: 'var(--fs-color-danger-text, #c0392b)',
            fontSize: '0.75rem',
            margin: '0.5rem 0 0',
          }}
        >
          {errorMessage}
        </p>
      )}

      {appliedCoupons.length > 0 && (
        <ul className={styles.couponList}>
          {appliedCoupons.map((coupon) => (
            <li key={coupon} className={styles.couponTag}>
              {coupon}
              <button
                onClick={() => handleRemove(coupon)}
                className={styles.couponRemove}
                aria-label={`Remove coupon ${coupon}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CouponSection
