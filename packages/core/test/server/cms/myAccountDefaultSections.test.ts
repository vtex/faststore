import { describe, expect, it } from 'vitest'

import {
  getDefaultMyAccountSections,
  withDefaultMyAccountSections,
} from '../../../src/server/cms/myAccountDefaultSections'

describe('getDefaultMyAccountSections', () => {
  it('returns the native section list for myAccountProfile', () => {
    expect(getDefaultMyAccountSections('myAccountProfile')).toEqual([
      {
        name: 'AccountNavigation',
        $componentKey: 'AccountNavigation',
        data: {},
      },
      { name: 'AccountProfile', $componentKey: 'AccountProfile', data: {} },
    ])
  })

  it('returns an empty list for store (unknown) content-types', () => {
    expect(getDefaultMyAccountSections('myAccountWishlist')).toEqual([])
  })

  /**
   * SFS-3325 — the order-details defaults must mirror the render order of the
   * `@deprecated OrderDetails.tsx` component, which is the design reference
   * available in the repo. The delivery option accordions travel with
   * AccountOrderDelivery, which is the single known deviation.
   */
  it('orders the myAccountOrderDetails defaults like the deprecated component', () => {
    expect(
      getDefaultMyAccountSections('myAccountOrderDetails').map(
        (section) => section.$componentKey
      )
    ).toEqual([
      'AccountNavigation',
      'AccountOrderDetails',
      'AccountOrderOrderedBy',
      'AccountOrderDelivery',
      'AccountOrderStatus',
      'AccountOrderPayment',
      'AccountOrderSummary',
      'AccountOrderMoreInfo',
      'AccountOrderBudgets',
    ])
  })

  it('keeps the myAccountOrderDetails default section set unchanged', () => {
    const keys = getDefaultMyAccountSections('myAccountOrderDetails').map(
      (section) => section.$componentKey
    )

    expect(new Set(keys)).toEqual(
      new Set([
        'AccountNavigation',
        'AccountOrderDetails',
        'AccountOrderStatus',
        'AccountOrderPayment',
        'AccountOrderDelivery',
        'AccountOrderSummary',
        'AccountOrderOrderedBy',
        'AccountOrderBudgets',
        'AccountOrderMoreInfo',
      ])
    )
  })
})

describe('withDefaultMyAccountSections', () => {
  it('returns published sections when present', () => {
    const sections = [
      {
        name: 'HelloAccount',
        $componentKey: 'HelloAccount',
        data: { label: 'Hi' },
      },
    ]

    expect(withDefaultMyAccountSections('myAccountWishlist', sections)).toEqual(
      sections
    )
  })

  it('falls back to defaults for native types when sections are empty', () => {
    expect(withDefaultMyAccountSections('myAccountSecurity', [])).toEqual(
      getDefaultMyAccountSections('myAccountSecurity')
    )
  })

  it('falls back to [] for store types when sections are empty', () => {
    expect(withDefaultMyAccountSections('myAccountWishlist', null)).toEqual([])
  })
})
