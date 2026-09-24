import { describe, expect, it } from 'vitest'

import {
  defaultListOrdersLabels,
  resolveListOrdersLabels,
} from '../../../../src/components/account/orders/ListOrders/listOrdersLabels'

describe('list orders labels', () => {
  it('provides English defaults for filter group labels', () => {
    expect(defaultListOrdersLabels.statusFilterLabel).toBe('Status')
    expect(defaultListOrdersLabels.orderDateFilterLabel).toBe('Order Date')
  })

  it('resolves localized filter group labels', () => {
    const labels = resolveListOrdersLabels({
      statusFilterLabel: 'Situação',
      orderDateFilterLabel: 'Data do pedido',
    })

    expect(labels.statusFilterLabel).toBe('Situação')
    expect(labels.orderDateFilterLabel).toBe('Data do pedido')
  })
})
