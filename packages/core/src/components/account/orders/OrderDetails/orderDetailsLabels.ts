export type OrderDetailsHeaderLabels = {
  orderNumberPrefix?: string
  goBackLabel?: string
  cancelOrderLabel?: string
  reorderLabel?: string
  notNowLabel?: string
  cancelConfirmMessage?: string
  cancelSuccessToast?: string
  cancelErrorToast?: string
  approveLabel?: string
  rejectLabel?: string
}

export type OrderStatusSectionLabels = {
  statusTitle?: string
  orderPlacedStep?: string
  paymentPendingStep?: string
  handlingStep?: string
  invoicedStep?: string
  deliveredStep?: string
}

export type OrderPaymentSectionLabels = {
  paymentTitle?: string
  billingLabel?: string
  bankInvoiceLabel?: string
  paypalLabel?: string
  giftCardLabel?: string
  endingInLabel?: string
  tidLabel?: string
  authIdLabel?: string
  invoiceNumberLabel?: string
  printBankInvoiceLabel?: string
  installmentCopy?: string
}

export type OrderDeliverySectionLabels = {
  deliveryTitle?: string
  recipientLabel?: string
  deliveryAddressLabel?: string
  storeAddressLabel?: string
  storeHoursLabel?: string
  fromLabel?: string
  toLabel?: string
  itemCountTemplate?: string
  eachLabel?: string
  taxesLabel?: string
  totalLabel?: string
}

export type OrderSummarySectionLabels = {
  summaryTitle?: string
  totalLabel?: string
  interestLabel?: string
}

export type OrderOrderedBySectionLabels = {
  orderedByTitle?: string
}

export type OrderBudgetsSectionLabels = {
  budgetsTitle?: string
  nameLabel?: string
  availableLabel?: string
  toBeSpentLabel?: string
  remainingLabel?: string
}

export type OrderMoreInfoSectionLabels = {
  moreInfoTitle?: string
}

export const defaultOrderDetailsHeaderLabels: Required<OrderDetailsHeaderLabels> =
  {
    orderNumberPrefix: 'Order #',
    goBackLabel: 'Go back',
    cancelOrderLabel: 'Cancel order',
    reorderLabel: 'Reorder',
    notNowLabel: 'Not now',
    cancelConfirmMessage:
      "Are you sure you want to cancel this order? This action can't be undone.",
    cancelSuccessToast: 'Order canceled successfully',
    cancelErrorToast: "Order couldn't be canceled due to a technical issue.",
    approveLabel: 'Approve',
    rejectLabel: 'Reject',
  }

export const defaultOrderStatusLabels: Required<OrderStatusSectionLabels> = {
  statusTitle: 'Status',
  orderPlacedStep: 'Order placed',
  paymentPendingStep: 'Payment Pending',
  handlingStep: 'Handling order',
  invoicedStep: 'Invoiced',
  deliveredStep: 'Delivered',
}

export const defaultOrderPaymentLabels: Required<OrderPaymentSectionLabels> = {
  paymentTitle: 'Payment',
  billingLabel: 'Billing',
  bankInvoiceLabel: 'Bank Invoice',
  paypalLabel: 'PayPal',
  giftCardLabel: 'Gift Card',
  endingInLabel: 'ending in',
  tidLabel: 'Tid:',
  authIdLabel: 'AuthId:',
  invoiceNumberLabel: 'Invoice Number:',
  printBankInvoiceLabel: 'Print Bank Invoice',
  installmentCopy: '{count}x of {value}',
}

export const defaultOrderDeliveryLabels: Required<OrderDeliverySectionLabels> =
  {
    deliveryTitle: 'Delivery',
    recipientLabel: 'Recipient',
    deliveryAddressLabel: 'Delivery address',
    storeAddressLabel: 'Store address',
    storeHoursLabel: 'Store Hours',
    fromLabel: 'From:',
    toLabel: 'To:',
    itemCountTemplate: '{count} item(s)',
    eachLabel: 'Each',
    taxesLabel: 'Taxes',
    totalLabel: 'Total',
  }

export const defaultOrderSummaryLabels: Required<OrderSummarySectionLabels> = {
  summaryTitle: 'Summary',
  totalLabel: 'Total',
  interestLabel: 'Interest',
}

export const defaultOrderOrderedByLabels: Required<OrderOrderedBySectionLabels> =
  {
    orderedByTitle: 'Ordered by',
  }

export const defaultOrderBudgetsLabels: Required<OrderBudgetsSectionLabels> = {
  budgetsTitle: 'Budgets',
  nameLabel: 'Name',
  availableLabel: 'Available',
  toBeSpentLabel: 'To be spent',
  remainingLabel: 'Remaining',
}

export const defaultOrderMoreInfoLabels: Required<OrderMoreInfoSectionLabels> =
  {
    moreInfoTitle: 'More information',
  }

export function resolveOrderDetailsHeaderLabels(
  labels?: OrderDetailsHeaderLabels
): Required<OrderDetailsHeaderLabels> {
  return { ...defaultOrderDetailsHeaderLabels, ...labels }
}

export function resolveOrderStatusLabels(
  labels?: OrderStatusSectionLabels
): Required<OrderStatusSectionLabels> {
  return { ...defaultOrderStatusLabels, ...labels }
}

export function resolveOrderPaymentLabels(
  labels?: OrderPaymentSectionLabels
): Required<OrderPaymentSectionLabels> {
  return { ...defaultOrderPaymentLabels, ...labels }
}

export function resolveOrderDeliveryLabels(
  labels?: OrderDeliverySectionLabels
): Required<OrderDeliverySectionLabels> {
  return { ...defaultOrderDeliveryLabels, ...labels }
}

export function resolveOrderSummaryLabels(
  labels?: OrderSummarySectionLabels
): Required<OrderSummarySectionLabels> {
  return { ...defaultOrderSummaryLabels, ...labels }
}

export function resolveOrderOrderedByLabels(
  labels?: OrderOrderedBySectionLabels
): Required<OrderOrderedBySectionLabels> {
  return { ...defaultOrderOrderedByLabels, ...labels }
}

export function resolveOrderBudgetsLabels(
  labels?: OrderBudgetsSectionLabels
): Required<OrderBudgetsSectionLabels> {
  return { ...defaultOrderBudgetsLabels, ...labels }
}

export function resolveOrderMoreInfoLabels(
  labels?: OrderMoreInfoSectionLabels
): Required<OrderMoreInfoSectionLabels> {
  return { ...defaultOrderMoreInfoLabels, ...labels }
}
