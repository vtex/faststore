import {
  orderStatusMap,
  type OrderStatusKey,
  type OrderStatusMapValue,
} from 'src/utils/userOrderStatus'

function getStatusVariant({ status }: { status: string }) {
  return (
    (orderStatusMap[status as OrderStatusKey] as OrderStatusMapValue)
      ?.variant || 'neutral'
  )
}

function MyAccountStatusBadge({
  status,
  statusFallback,
}: { status: string; statusFallback?: string }) {
  return (
    <span
      data-fs-my-account-badge
      data-fs-my-account-badge-variant={getStatusVariant({ status })}
    >
      {orderStatusMap[status as OrderStatusKey]?.label || statusFallback || '-'}
    </span>
  )
}

export default MyAccountStatusBadge
