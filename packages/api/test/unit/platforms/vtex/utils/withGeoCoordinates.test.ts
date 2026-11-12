import type { Context } from '../../../../../src/platforms/vtex'
import type { IStoreSession } from '../../../../../src/__generated__/schema'
import { withGeoCoordinates } from '../../../../../src/platforms/vtex/utils/withGeoCoordinates'

const session = {
  postalCode: '05001100',
  country: 'BRA',
  geoCoordinates: null,
} as IStoreSession

const createCommerce = (address: jest.Mock) =>
  ({ checkout: { address } }) as unknown as Context['clients']['commerce']

describe('withGeoCoordinates', () => {
  it('Should fill the coordinates from the postal code', async () => {
    const address = jest.fn().mockResolvedValue({
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
    const address = jest.fn()
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
    const address = jest.fn()
    const sessionWithoutPostalCode = { ...session, postalCode: null }

    const result = await withGeoCoordinates(
      sessionWithoutPostalCode,
      createCommerce(address)
    )

    expect(address).not.toHaveBeenCalled()
    expect(result).toBe(sessionWithoutPostalCode)
  })

  it('Should keep the session when the postal code has no coordinates', async () => {
    const address = jest.fn().mockResolvedValue({ geoCoordinates: [] })

    const result = await withGeoCoordinates(session, createCommerce(address))

    expect(result).toBe(session)
  })

  it('Should keep the session when the lookup fails', async () => {
    const address = jest.fn().mockRejectedValue(new Error('timeout'))

    const result = await withGeoCoordinates(session, createCommerce(address))

    expect(result).toBe(session)
  })
})
