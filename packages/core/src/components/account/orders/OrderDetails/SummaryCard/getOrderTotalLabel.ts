import type { OrderSummarySectionLabels } from '../orderDetailsLabels'

const TOTAL_LABEL_KEYS = {
  items: 'itemsTotalLabel',
  discounts: 'discountsTotalLabel',
  shipping: 'shippingTotalLabel',
  tax: 'taxTotalLabel',
  change: 'changeTotalLabel',
  interest: 'interestLabel',
} as const satisfies Record<string, keyof OrderSummarySectionLabels>

export function getOrderTotalLabel(
  total: { id: string; name: string },
  labels: Required<OrderSummarySectionLabels>
): string {
  const labelKey = TOTAL_LABEL_KEYS[total.id.toLowerCase()]

  return labelKey ? labels[labelKey] : total.name
}
