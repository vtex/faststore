import type { OrderStatusCmsLabels } from 'src/utils/userOrderStatus'
import {
  getLocalizedOrderStatusMap,
  getOrderStatusLabel,
  type OrderStatusKey,
  type OrderStatusMapValue,
} from 'src/utils/userOrderStatus'

function getStatusVariant({
  status,
  statusMap,
}: {
  status: string
  statusMap: Record<OrderStatusKey, OrderStatusMapValue>
}) {
  return (
    (statusMap[status as OrderStatusKey] as OrderStatusMapValue)?.variant ||
    'neutral'
  )
}

function StatusBadge({
  status,
  statusFallback,
  statusLabels,
}: {
  status: string
  statusFallback?: string
  statusLabels?: OrderStatusCmsLabels
}) {
  const statusMap = getLocalizedOrderStatusMap(statusLabels)

  return (
    <span
      data-fs-my-account-badge
      data-fs-my-account-badge-variant={getStatusVariant({ status, statusMap })}
    >
      {getOrderStatusLabel({ status, cmsLabels: statusLabels, statusFallback })}
    </span>
  )
}

export default StatusBadge
