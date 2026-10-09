import { beforeEach, describe, expect, it, vi } from 'vitest'

const { config, request } = vi.hoisted(() => ({
  config: { enabled: true },
  request: vi.fn(),
}))

vi.mock('discovery.config', () => ({
  get deliveryPromise() {
    return { enabled: config.enabled }
  },
}))

vi.mock('src/sdk/graphql/request', () => ({
  request,
}))

import { getPickupPoints } from '../../../src/sdk/deliveryPromise/queries'

describe('getPickupPoints', () => {
  beforeEach(() => {
    config.enabled = true
    request.mockReset()
  })

  it('skips the request when delivery promise is disabled', async () => {
    config.enabled = false

    await expect(
      getPickupPoints({
        geoCoordinates: { latitude: -23.56, longitude: -46.65 },
        postalCode: '01310100',
        country: 'BRA',
      })
    ).resolves.toEqual([])
    expect(request).not.toHaveBeenCalled()
  })

  it('skips the request when postal code and coordinates are both missing', async () => {
    await expect(
      getPickupPoints({
        geoCoordinates: null,
        postalCode: null,
        country: 'BRA',
      })
    ).resolves.toEqual([])
    expect(request).not.toHaveBeenCalled()
  })

  it('requests pickup points with postal code and country and no coordinates', async () => {
    request.mockResolvedValue({
      pickupPoints: {
        pickupPointDistances: [
          {
            pickupId: 'vendemo_1',
            pickupName: 'VTEX Rio',
            isActive: true,
            distance: 2.7,
            address: {
              street: 'Praia de Botafogo',
              number: '300',
              postalCode: '22250-040',
              city: 'Rio de Janeiro',
              state: 'RJ',
            },
          },
          {
            pickupId: 'inactive',
            pickupName: 'Closed',
            isActive: false,
            distance: 1,
            address: null,
          },
        ],
      },
    })

    const channel = JSON.stringify({ salesChannel: '2', regionId: '' })
    const points = await getPickupPoints({
      geoCoordinates: null,
      postalCode: '22041080',
      country: 'BRA',
      channel,
    })

    expect(request).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        postalCode: '22041080',
        country: 'BRA',
        channel,
        geoCoordinates: undefined,
      })
    )
    expect(points).toEqual([
      {
        id: 'vendemo_1',
        name: 'VTEX Rio',
        totalItems: 2,
        address: {
          street: 'Praia de Botafogo',
          number: '300',
          postalCode: '22250-040',
          city: 'Rio de Janeiro',
          state: 'RJ',
        },
        distance: 2.7,
      },
    ])
  })

  it('returns an empty list when the request has no data', async () => {
    request.mockResolvedValueOnce(null)

    await expect(
      getPickupPoints({
        geoCoordinates: null,
        postalCode: '01310100',
        country: 'BRA',
      })
    ).resolves.toEqual([])
  })
})
