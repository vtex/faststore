import { describe, expect, it, type Mock, vi } from 'vitest'
import type { IStoreSession } from '../../../../../src/__generated__/schema'
import type { GraphqlContext } from '../../../../../src/platforms/vtex'
import { withGeoCoordinates } from '../../../../../src/platforms/vtex/utils/withGeoCoordinates'

const session = {
  postalCode: '05001100',
  country: 'BRA',
  geoCoordinates: null,
} as IStoreSession

const createCommerce = (address: Mock) =>
  ({
    checkout: { address },
  }) as unknown as GraphqlContext['clients']['commerce']

describe('withGeoCoordinates', () => {
  it('Should fill the coordinates from the postal code', async () => {
    const address = vi.fn().mockResolvedValue({
      geoCoordinates: [-46.675491333, -23.526170731],
    })

    const result = await withGeoCoordinates(session, createCommerce(address))

    expect(address).toHaveBeenCalledWith({
      postalCode: '05001100',
      country: 'BRA',
    })
    expect(result).toEqual({
      ...session,
      geoCoordinates: { latitude: -23.526170731, longitude: -46.675491333 },
    })
  })

  it('Should keep the session coordinates when they are already set', async () => {
    const address = vi.fn()
    const sessionWithCoordinates = {
      ...session,
      geoCoordinates: { latitude: -23.5, longitude: -46.6 },
    }

    const result = await withGeoCoordinates(
      sessionWithCoordinates,
      createCommerce(address)
    )

    expect(address).not.toHaveBeenCalled()
    expect(result).toBe(sessionWithCoordinates)
  })

  it('Should not look up when the session has no postal code', async () => {
    const address = vi.fn()
    const sessionWithoutPostalCode = { ...session, postalCode: null }

    const result = await withGeoCoordinates(
      sessionWithoutPostalCode,
      createCommerce(address)
    )

    expect(address).not.toHaveBeenCalled()
    expect(result).toBe(sessionWithoutPostalCode)
  })

  it('Should not look up when the session has no country', async () => {
    const address = vi.fn()
    const sessionWithoutCountry = { ...session, country: '' }

    const result = await withGeoCoordinates(
      sessionWithoutCountry,
      createCommerce(address)
    )

    expect(address).not.toHaveBeenCalled()
    expect(result).toBe(sessionWithoutCountry)
  })

  it.each([
    ['no coordinates', { geoCoordinates: [] }],
    ['non-numeric coordinates', { geoCoordinates: ['-46.6', '-23.5'] }],
    ['no geoCoordinates field', {}],
  ])(
    'Should keep the session when the postal code has %s',
    async (_, response) => {
      const address = vi.fn().mockResolvedValue(response)

      const result = await withGeoCoordinates(session, createCommerce(address))

      expect(result).toBe(session)
    }
  )

  it('Should keep the session when the lookup returns no body', async () => {
    const address = vi.fn().mockResolvedValue(undefined)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = await withGeoCoordinates(session, createCommerce(address))

    expect(result).toBe(session)
    expect(warn).toHaveBeenCalledOnce()
    warn.mockRestore()
  })

  it('Should keep the session and log when the lookup fails', async () => {
    const address = vi.fn().mockRejectedValue(new Error('timeout'))
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = await withGeoCoordinates(session, createCommerce(address))

    expect(result).toBe(session)
    expect(warn).toHaveBeenCalledOnce()
    warn.mockRestore()
  })

  it('Should not mutate the original session', async () => {
    const address = vi.fn().mockResolvedValue({
      geoCoordinates: [-46.675491333, -23.526170731],
    })
    const original = { ...session }

    await withGeoCoordinates(original, createCommerce(address))

    expect(original).toEqual(session)
  })
})
