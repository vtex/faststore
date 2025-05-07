import styles from './styles.module.scss'

import {
  orderStatusMap,
  type OrderStatusKey,
  type OrderStatusMapValue,
} from 'src/utils/userOrderStatus'

function getStatusVariant({ status }: { status: string }) {
  const variant =
    (orderStatusMap[status as OrderStatusKey] as OrderStatusMapValue)
      ?.variant || 'neutral'

  return variant.charAt(0).toUpperCase() + variant.slice(1)
}

function MyAccountStatusBadge({
  status,
  statusFallback,
}: { status: string; statusFallback?: string }) {
  return (
    <span
      className={`${styles.status} ${
        styles[`status${getStatusVariant({ status })}`]
      }`}
    >
      {orderStatusMap[status as OrderStatusKey]?.label || statusFallback || '-'}
    </span>
  )
}

export default MyAccountStatusBadge
