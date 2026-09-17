import { describe, expect, it } from 'vitest'

import { getOrderTotalLabel } from '../../../../src/components/account/orders/OrderDetails/SummaryCard/getOrderTotalLabel'
import { resolveOrderSummaryLabels } from '../../../../src/components/account/orders/OrderDetails/orderDetailsLabels'

const labels = resolveOrderSummaryLabels({
  itemsTotalLabel: 'Produtos',
  discountsTotalLabel: 'Descontos',
  shippingTotalLabel: 'Frete',
  taxTotalLabel: 'Impostos',
  changeTotalLabel: 'Alterações',
})

describe('getOrderTotalLabel', () => {
  it.each([
    ['Items', 'Produtos'],
    ['Discounts', 'Descontos'],
    ['Shipping', 'Frete'],
    ['Tax', 'Impostos'],
    ['Change', 'Alterações'],
  ])('localizes the documented OMS %s total', (id, expected) => {
    expect(getOrderTotalLabel({ id, name: `${id} from OMS` }, labels)).toBe(
      expected
    )
  })

  it('falls back to the OMS name for an unknown total id', () => {
    expect(
      getOrderTotalLabel(
        { id: 'FutureTotal', name: 'Future total from OMS' },
        labels
      )
    ).toBe('Future total from OMS')
  })
})
