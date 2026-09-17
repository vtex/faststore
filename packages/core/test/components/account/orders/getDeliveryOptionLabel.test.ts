import { describe, expect, it } from 'vitest'

import {
  getDeliveryOptionKey,
  getDeliveryOptionLabel,
} from '../../../../src/components/account/orders/OrderDetails/getDeliveryOptionLabel'
import { resolveOrderDeliveryLabels } from '../../../../src/components/account/orders/OrderDetails/orderDetailsLabels'

const labels = resolveOrderDeliveryLabels({
  deliveryChannelLabel: 'Entrega',
  pickupChannelLabel: 'Retirada',
  takeAwayChannelLabel: 'Levar',
  businessDaysZeroTemplate: 'bd-0',
  businessDaysOneTemplate: 'bd-1',
  businessDaysOtherTemplate: 'bd-{count}',
  daysZeroTemplate: 'd-0',
  daysOneTemplate: 'd-1',
  daysOtherTemplate: 'd-{count}',
  hoursZeroTemplate: 'h-0',
  hoursOneTemplate: 'h-1',
  hoursOtherTemplate: 'h-{count}',
  minutesZeroTemplate: 'm-0',
  minutesOneTemplate: 'm-1',
  minutesOtherTemplate: 'm-{count}',
  toNeighborhoodTemplate: 'para {neighborhood}',
})

describe('getDeliveryOptionLabel', () => {
  it.each([
    ['0bd', 'bd-0'],
    ['1bd', 'bd-1'],
    ['5bd', 'bd-5'],
    ['0d', 'd-0'],
    ['1d', 'd-1'],
    ['5d', 'd-5'],
    ['0h', 'h-0'],
    ['1h', 'h-1'],
    ['5h', 'h-5'],
    ['0m', 'm-0'],
    ['1m', 'm-1'],
    ['5m', 'm-5'],
  ])('localizes shipping estimate %s', (shippingEstimate, expected) => {
    expect(
      getDeliveryOptionLabel({ deliveryChannel: '', shippingEstimate }, labels)
    ).toBe(expected)
  })

  it.each([
    ['delivery', 'Entrega'],
    ['pickup', 'Retirada'],
    ['pickup-in-point', 'Retirada'],
    ['take-away', 'Levar'],
  ])('localizes the %s channel', (deliveryChannel, expected) => {
    expect(
      getDeliveryOptionLabel(
        { deliveryChannel, shippingEstimate: '1d' },
        labels
      )
    ).toBe(`${expected} d-1`)
  })

  it('localizes the neighborhood connector while preserving its value', () => {
    expect(
      getDeliveryOptionLabel(
        {
          deliveryChannel: 'delivery',
          shippingEstimate: '5bd',
          address: { neighborhood: 'Botafogo' },
        },
        labels
      )
    ).toBe('Entrega bd-5 para Botafogo')
  })

  it('treats padded one-unit estimates the same way as the API parser', () => {
    expect(
      getDeliveryOptionLabel(
        { deliveryChannel: '', shippingEstimate: '01bd' },
        labels
      )
    ).toBe('bd-1')
  })

  it('builds a stable key from the same grouping fields as the API', () => {
    expect(
      getDeliveryOptionKey({
        selectedSla: 'Normal',
        deliveryChannel: 'delivery',
        deliveryCompany: 'Correios',
        seller: '1',
        shippingEstimate: '5bd',
        shippingEstimateDate: '2026-08-05T00:00:00Z',
        address: { addressId: 'addr-1' },
        deliveryWindow: {
          startDateUtc: '2026-08-05T10:00:00Z',
          endDateUtc: '2026-08-05T18:00:00Z',
        },
      })
    ).toBe(
      'Normal|delivery|Correios|1|5bd|2026-08-05T00:00:00Z|addr-1|2026-08-05T10:00:00Z|2026-08-05T18:00:00Z'
    )
  })

  it('preserves the API fallback for unsupported raw values', () => {
    expect(
      getDeliveryOptionLabel(
        {
          deliveryChannel: 'future-channel',
          shippingEstimate: 'someday',
          friendlyDeliveryOptionName: 'Existing API label',
        },
        labels
      )
    ).toBe('Existing API label')
  })
})
