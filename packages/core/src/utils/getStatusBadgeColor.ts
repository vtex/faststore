import type { BadgeVariants } from '@faststore/components/dist/esm/atoms/Badge/Badge'

export type OrderStatus =
  | 'order-created'
  | 'ready-for-handling'
  | 'start-handling'
  | 'waiting-for-manual-authorization'
  | 'authorize-fulfillment'
  | 'payment-approved'
  | 'payment-denied'
  | 'payment-pending'
  | 'canceled'
  | 'cancel'
  | 'request-cancel'
  | 'invoiced'
  | 'invoice'

/**
 * @description Returns the color of the badge based on the order status.
 * @link See the full list of order statuses in the OrderStatus type on: https://help.vtex.com/en/tutorial/fluxo-e-status-de-pedidos--tutorials_196#order-status-details
 */
export const getStatusBadgeColor = (
  status: OrderStatus
): { color: BadgeVariants } => {
  switch (status) {
    case 'order-created':
      return { color: 'success' }
    case 'ready-for-handling':
      return { color: 'success' }
    case 'start-handling':
      return { color: 'success' }
    case 'waiting-for-manual-authorization':
      return { color: 'success' }
    case 'authorize-fulfillment':
      return { color: 'success' }
    case 'payment-approved':
      return { color: 'success' }
    case 'payment-denied':
      return { color: 'neutral' }
    case 'payment-pending':
      return { color: 'warning' }
    case 'canceled':
      return { color: 'neutral' }
    case 'cancel':
      return { color: 'neutral' }
    case 'request-cancel':
      return { color: 'neutral' }
    case 'invoiced':
      return { color: 'success' }
    case 'invoice':
      return { color: 'success' }
    default:
      return { color: 'neutral' }
  }
}
