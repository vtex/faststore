import type { OrderSummarySectionLabels } from '../orderDetailsLabels'

const TOTAL_LABEL_KEYS: Partial<
  Record<string, keyof OrderSummarySectionLabels>
> = {
  items: 'itemsTotalLabel',
  discounts: 'discountsTotalLabel',
  shipping: 'shippingTotalLabel',
  tax: 'taxTotalLabel',
  change: 'changeTotalLabel',
  interest: 'interestLabel',
}

export function getOrderTotalLabel(
  total: { id?: string | null; name?: string | null },
  labels: Required<OrderSummarySectionLabels>
): string {
  const labelKey = TOTAL_LABEL_KEYS[(total.id ?? '').toLowerCase()]

  return labelKey ? labels[labelKey] : (total.name ?? '')
}
