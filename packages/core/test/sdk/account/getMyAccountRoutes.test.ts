import { describe, expect, it } from 'vitest'

import {
  ORDERS_ROUTE,
  PROFILE_ROUTE,
  QUOTES_ROUTE,
  ROUTES_ONLY_FOR_B2B_MEMBERS,
  SECURITY_ROUTE,
  USER_DETAILS_ROUTE,
  getExtraMyAccountRoutes,
  getMyAccountRoutes,
} from '../../../src/sdk/account/getMyAccountRoutes'

describe('getMyAccountRoutes', () => {
  it('includes the default routes plus any extra routes provided', () => {
    const result = getMyAccountRoutes({
      routes: [{ title: 'Custom', route: '/custom' }],
    })

    expect(result.map((r) => r.route)).toEqual([
      PROFILE_ROUTE,
      ORDERS_ROUTE,
      QUOTES_ROUTE,
      USER_DETAILS_ROUTE,
      SECURITY_ROUTE,
      '/pvt/custom',
    ])
  })

  it('prefixes routes with /pvt when missing', () => {
    const result = getMyAccountRoutes({
      routes: [{ title: 'Custom', route: '/custom' }],
    })

    expect(result.find((r) => r.title === 'Custom')?.route).toBe('/pvt/custom')
  })

  it('leaves titles unchanged when no labels are provided', () => {
    const result = getMyAccountRoutes({ routes: [] })

    expect(result.find((r) => r.route === QUOTES_ROUTE)?.title).toBe('Quotes')
  })

  it('overrides default route titles with matching CMS labels', () => {
    const result = getMyAccountRoutes({
      routes: [],
      labels: { profileLabel: 'Meu Perfil', ordersLabel: 'Meus Pedidos' },
    })

    expect(result.find((r) => r.route === PROFILE_ROUTE)?.title).toBe(
      'Meu Perfil'
    )
    expect(result.find((r) => r.route === ORDERS_ROUTE)?.title).toBe(
      'Meus Pedidos'
    )
  })

  it('falls back to the default title when a label key has no CMS value', () => {
    const result = getMyAccountRoutes({
      routes: [],
      labels: { profileLabel: undefined },
    })

    expect(result.find((r) => r.route === PROFILE_ROUTE)?.title).toBe('Profile')
  })

  it('does not relabel routes with no matching label key (e.g. Quotes)', () => {
    const result = getMyAccountRoutes({
      routes: [],
      labels: { profileLabel: 'Meu Perfil' },
    })

    expect(result.find((r) => r.route === QUOTES_ROUTE)?.title).toBe('Quotes')
  })

  it('preserves contentType through getMyAccountRoutes', () => {
    const result = getMyAccountRoutes({
      routes: [
        {
          title: 'Wishlist',
          route: '/pvt/account/wishlist',
          contentType: 'myAccountWishlist',
        },
      ],
    })

    const wishlist = result.find((r) => r.route === '/pvt/account/wishlist')
    expect(wishlist?.contentType).toBe('myAccountWishlist')
    expect(wishlist?.title).toBe('Wishlist')
  })

  it('keeps custom-route titles when CMS labels override native routes (FR-011)', () => {
    const result = getMyAccountRoutes({
      routes: [
        {
          title: 'Wishlist',
          route: '/pvt/account/wishlist',
          contentType: 'myAccountWishlist',
        },
      ],
      labels: { profileLabel: 'Meu Perfil', ordersLabel: 'Meus Pedidos' },
    })

    expect(result.find((r) => r.route === PROFILE_ROUTE)?.title).toBe(
      'Meu Perfil'
    )
    expect(result.find((r) => r.route === ORDERS_ROUTE)?.title).toBe(
      'Meus Pedidos'
    )
    expect(result.find((r) => r.route === '/pvt/account/wishlist')?.title).toBe(
      'Wishlist'
    )
  })

  it('marks Quotes as a B2B-only route', () => {
    expect(ROUTES_ONLY_FOR_B2B_MEMBERS).toContain(QUOTES_ROUTE)
  })
})

describe('getExtraMyAccountRoutes', () => {
  it('filters out routes that are already part of the default set', () => {
    const result = getExtraMyAccountRoutes([
      { title: 'Profile', route: PROFILE_ROUTE },
      { title: 'Custom', route: '/pvt/custom' },
    ])

    expect(result).toEqual([{ title: 'Custom', route: '/pvt/custom' }])
  })
})
