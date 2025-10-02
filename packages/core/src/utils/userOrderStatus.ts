export const orderStatusMap = {
  // Order Placed
  created: { variant: 'success', label: 'Order Placed' },
  creating: { variant: 'success', label: 'Order Placed' },
  'on-order-completed': { variant: 'success', label: 'Order Placed' },
  'on-order-completed-ffm': { variant: 'success', label: 'Order Placed' },
  'order-accepted': { variant: 'success', label: 'Order Placed' },
  'order-created': { variant: 'success', label: 'Order Placed' },
  'waiting-for-seller-confirmation': {
    variant: 'success',
    label: 'Order Placed',
  },

  // Pending approval
  'waiting-for-authorization': {
    variant: 'warning',
    label: 'Pending approval',
  },
  'waiting-for-confirmation': { variant: 'warning', label: 'Pending approval' },

  // Payment Pending
  'approving-transaction': { variant: 'warning', label: 'Payment Pending' },
  'notify-payment': { variant: 'warning', label: 'Payment Pending' },
  'payment-pending': { variant: 'warning', label: 'Payment Pending' },

  // Payment Approved
  'payment-approved': { variant: 'success', label: 'Payment Approved' },
  'approve-payment': { variant: 'success', label: 'Payment Approved' },

  // Payment Denied
  'payment-denied': { variant: 'neutral', label: 'Payment Denied' },

  // Ready for Delivery
  'authorize-fulfillment': { variant: 'success', label: 'Ready for Delivery' },
  handling: { variant: 'success', label: 'Ready for Delivery' },
  invoice: { variant: 'success', label: 'Ready for Delivery' },
  'invoice-after-cancellation-deny': {
    variant: 'success',
    label: 'Ready for Delivery',
  },
  invoicing: { variant: 'success', label: 'Ready for Delivery' },
  packing: { variant: 'success', label: 'Ready for Delivery' },
  picking: { variant: 'success', label: 'Ready for Delivery' },
  'ready-for-handling': { variant: 'success', label: 'Ready for Delivery' },
  'ready-for-invoicing': { variant: 'success', label: 'Ready for Delivery' },
  'ready-for-packing': { variant: 'success', label: 'Ready for Delivery' },
  'ready-for-picking': { variant: 'success', label: 'Ready for Delivery' },
  'release-to-fulfillment': { variant: 'success', label: 'Ready for Delivery' },
  'start-handling': { variant: 'success', label: 'Ready for Delivery' },
  'waiting-ffmt-authorization': {
    variant: 'success',
    label: 'Ready for Delivery',
  },
  'waiting-for-fulfillment': {
    variant: 'success',
    label: 'Ready for Delivery',
  },
  'window-to-cancel': { variant: 'success', label: 'Ready for Delivery' },

  // Invoiced
  invoiced: { variant: 'success', label: 'Invoiced' },

  // Cancellation Requested
  'accepting-cancel': { variant: 'neutral', label: 'Cancellation Requested' },
  cancel: { variant: 'neutral', label: 'Cancellation Requested' },
  canceling: { variant: 'neutral', label: 'Cancellation Requested' },
  'cancellation-requested': {
    variant: 'neutral',
    label: 'Cancellation Requested',
  },
  'cancellation-requested-with-ack': {
    variant: 'neutral',
    label: 'Cancellation Requested',
  },
  'request-cancel': { variant: 'neutral', label: 'Cancellation Requested' },
  'waiting-for-seller-decision': {
    variant: 'neutral',
    label: 'Cancellation Requested',
  },

  // Canceled
  canceled: { variant: 'neutral', label: 'Canceled' },

  // Status not mapped yet
  // waiting-for-manual-authorization
  // authorizing
  // processing
  // replaced
  // waiting-for-authorization
  // waiting-for-manual-authorization
  // waiting-for-mkt-authorization
  // window-to-change-payment
  // window-to-change-seller
  // end
}

export type OrderStatusMapValue = {
  variant: 'success' | 'warning' | 'neutral'
  label: string
}

export type OrderStatusKey = keyof typeof orderStatusMap
export type OrderStatusVariant =
  (typeof orderStatusMap)[OrderStatusKey]['variant']

export const groupOrderStatusByLabel = (): Record<string, string[]> => {
  const groupedStatus: Record<string, string[]> = {}

  for (const [key, value] of Object.entries(orderStatusMap)) {
    const { label } = value
    const labelLower = label.toLowerCase()

    if (!groupedStatus[labelLower]) {
      groupedStatus[labelLower] = []
    }

    groupedStatus[labelLower].push(key)
  }

  return groupedStatus
}

export const FastStoreOrderStatus = [
  'Order Placed',
  'Pending approval',
  'Payment Pending',
  'Payment Approved',
  'Payment Denied',
  'Ready for Delivery',
  'Invoiced',
  'Cancellation Requested',
  'Canceled',
]

export const FastStoreOrderStatusWithLabels = {
  'order placed': 'Order Placed',
  'Pending approval': 'Pending approval',
  'payment pending': 'Payment Pending',
  'payment approved': 'Payment Approved',
  'payment denied': 'Payment Denied',
  'ready for delivery': 'Ready for Delivery',
  invoiced: 'Invoiced',
  'cancellation requested': 'Cancellation Requested',
  canceled: 'Canceled',
}
