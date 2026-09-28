import { describe, expect, it } from 'vitest'

import {
  defaultOrderDeliveryLabels,
  resolveOrderDeliveryLabels,
} from '../../../../src/components/account/orders/OrderDetails/orderDetailsLabels'

describe('order details labels', () => {
  it('uses English delivery labels by default', () => {
    expect(resolveOrderDeliveryLabels()).toEqual(defaultOrderDeliveryLabels)
    expect(defaultOrderDeliveryLabels.eachLabel).toBe('Each')
  })
})
