import { describe, expect, it } from 'vitest'

import {
  getLocalizedOrderStatusMap,
  getOrderStatusLabel,
  orderStatusMap,
} from 'src/utils/userOrderStatus'

describe('getLocalizedOrderStatusMap', () => {
  it('returns default labels when CMS labels are not provided', () => {
    const map = getLocalizedOrderStatusMap()

    expect(map['payment-approved'].label).toBe(
      orderStatusMap['payment-approved'].label
    )
  })

  it('overrides labels for all statuses in the same group', () => {
    const map = getLocalizedOrderStatusMap({
      paymentApprovedStatus: 'Pagamento aprovado',
    })

    expect(map['payment-approved'].label).toBe('Pagamento aprovado')
    expect(map['approve-payment'].label).toBe('Pagamento aprovado')
  })

  it('resolves display label with fallback for unmapped statuses', () => {
    expect(
      getOrderStatusLabel({
        status: 'unknown-status',
        cmsLabels: { canceledStatus: 'Cancelado' },
        statusFallback: 'Custom fallback',
      })
    ).toBe('Custom fallback')
  })
})
