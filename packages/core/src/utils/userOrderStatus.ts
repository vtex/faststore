export const orderStatusMap = {
  'authorize-fulfillment': { variant: 'success', label: 'Ready for Shipping' },
  cancel: { variant: 'neutral', label: 'Canceled' },
  canceled: { variant: 'neutral', label: 'Canceled' },
  invoice: { variant: 'success', label: 'Ready for Shipping' },
  'invoice-after-cancellation-deny': {
    variant: 'success',
    label: 'Ready for Shipping',
  },
  invoiced: { variant: 'success', label: 'Invoiced' },
  'on-order-completed': { variant: 'success', label: 'Order Placed' },
  'on-order-completed-ffm': { variant: 'success', label: 'Order Placed' },
  'order-accepted': { variant: 'success', label: 'Order Placed' },
  'order-created': { variant: 'success', label: 'Order Placed' },
  'payment-approved': { variant: 'success', label: 'Payment Approved' },
  'payment-denied': { variant: 'neutral', label: 'Payment Denied' },
  'payment-pending': { variant: 'warning', label: 'Payment Pending' },
  'ready-for-handling': { variant: 'success', label: 'Ready for Shipping' },
  'request-cancel': { variant: 'neutral', label: 'Canceled' },
  'cancellation-requested': {
    variant: 'neutral',
    label: 'Cancellation Requested',
  },
  'start-handling': { variant: 'success', label: 'Ready for Shipping' },
  'waiting-for-manual-authorization': {
    variant: 'success',
    label: 'Ready for Shipping',
  },
}

export type OrderStatusMapValue = {
  variant: 'success' | 'warning' | 'neutral'
  label: string
}

export type OrderStatusKey = keyof typeof orderStatusMap
export type OrderStatusVariant =
  (typeof orderStatusMap)[OrderStatusKey]['variant']
