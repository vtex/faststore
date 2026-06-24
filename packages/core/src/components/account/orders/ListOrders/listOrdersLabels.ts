import type { OrderStatusCmsLabels } from 'src/utils/userOrderStatus'
import { pickOrderStatusCmsLabels as pickOrderStatusCmsLabelsFromData } from 'src/utils/userOrderStatus'

export type ListOrdersSectionLabels = {
  pageTitle?: string
  searchPlaceholder?: string
  filtersLabel?: string
  clearAllLabel?: string
  viewResultsLabel?: string
  noResultsLabel?: string
  noOrdersLabel?: string
  startShoppingLabel?: string
  placedOnLabel?: string
  deliveryByLabel?: string
  pendingApprovalLabel?: string
  paginationOfLabel?: string
  previousPageLabel?: string
  nextPageLabel?: string
  viewAllLabel?: string
  viewLessLabel?: string
  fromLabel?: string
  toLabel?: string
  invalidDateRangeLabel?: string
  orderPlacedStatus?: string
  pendingApprovalStatus?: string
  paymentPendingStatus?: string
  paymentApprovedStatus?: string
  paymentDeniedStatus?: string
  readyForDeliveryStatus?: string
  invoicedStatus?: string
  cancellationRequestedStatus?: string
  canceledStatus?: string
}

export const defaultListOrdersLabels: Required<ListOrdersSectionLabels> = {
  pageTitle: 'Orders',
  searchPlaceholder: 'Search',
  filtersLabel: 'Filters',
  clearAllLabel: 'Clear All',
  viewResultsLabel: 'View Results',
  noResultsLabel: 'No results found',
  noOrdersLabel: "You don't have any orders",
  startShoppingLabel: 'Start shopping',
  placedOnLabel: 'Placed on',
  deliveryByLabel: 'Delivery by',
  pendingApprovalLabel: 'Pending my approval',
  paginationOfLabel: 'of',
  previousPageLabel: 'Previous Page',
  nextPageLabel: 'Next Page',
  viewAllLabel: 'View all',
  viewLessLabel: 'View less',
  fromLabel: 'From',
  toLabel: 'To',
  invalidDateRangeLabel: 'Invalid date range',
  orderPlacedStatus: 'Order Placed',
  pendingApprovalStatus: 'Pending approval',
  paymentPendingStatus: 'Payment Pending',
  paymentApprovedStatus: 'Payment Approved',
  paymentDeniedStatus: 'Payment Denied',
  readyForDeliveryStatus: 'Ready for Delivery',
  invoicedStatus: 'Invoiced',
  cancellationRequestedStatus: 'Cancellation Requested',
  canceledStatus: 'Canceled',
}

const STATUS_LABEL_KEYS = [
  'orderPlacedStatus',
  'pendingApprovalStatus',
  'paymentPendingStatus',
  'paymentApprovedStatus',
  'paymentDeniedStatus',
  'readyForDeliveryStatus',
  'invoicedStatus',
  'cancellationRequestedStatus',
  'canceledStatus',
] as const satisfies readonly (keyof ListOrdersSectionLabels)[]

export function resolveListOrdersLabels(
  labels?: ListOrdersSectionLabels
): Required<ListOrdersSectionLabels> {
  return { ...defaultListOrdersLabels, ...labels }
}

export function getStatusDisplayLabels(
  labels: Required<ListOrdersSectionLabels>
): Record<string, string> {
  return {
    'order placed': labels.orderPlacedStatus,
    'pending approval': labels.pendingApprovalStatus,
    'payment pending': labels.paymentPendingStatus,
    'payment approved': labels.paymentApprovedStatus,
    'payment denied': labels.paymentDeniedStatus,
    'ready for delivery': labels.readyForDeliveryStatus,
    invoiced: labels.invoicedStatus,
    'cancellation requested': labels.cancellationRequestedStatus,
    canceled: labels.canceledStatus,
  }
}

export function getStatusFacetLabels(
  labels: Required<ListOrdersSectionLabels>
): string[] {
  return STATUS_LABEL_KEYS.map((key) => labels[key])
}

export function pickOrderStatusCmsLabels(
  labels?: ListOrdersSectionLabels
): OrderStatusCmsLabels | undefined {
  return pickOrderStatusCmsLabelsFromData(
    labels as Record<string, unknown> | undefined
  )
}
