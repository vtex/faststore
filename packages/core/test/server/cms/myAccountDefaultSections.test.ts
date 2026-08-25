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
