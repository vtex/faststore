import { describe, expect, it } from 'vitest'

import {
  deliveryPromiseReducer,
  initializeDeliveryPromiseState,
} from '../../../src/sdk/deliveryPromise/reducer'

describe('deliveryPromiseReducer onPostalCodeChange', () => {
  it('stores the simulated postal code and country', () => {
    const next = deliveryPromiseReducer(initializeDeliveryPromiseState(), {
      type: 'onPostalCodeChange',
      payload: {
        simulatePickupPoints: true,
        validatedSession: {
          postalCode: '22041080',
          country: 'BRA',
          geoCoordinates: { latitude: -22.95, longitude: -43.19 },
        },
      },
    })

    expect(next.simulatePickupPoints).toBe(true)
    expect(next.shouldUpdatePickupPoints).toBe(true)
    expect(next.pickupPointsSimulation).toMatchObject({
      postalCode: '22041080',
      country: 'BRA',
      geoCoordinates: { latitude: -22.95, longitude: -43.19 },
    })
  })

  it('stores null when the validated session omits the location', () => {
    const next = deliveryPromiseReducer(initializeDeliveryPromiseState(), {
      type: 'onPostalCodeChange',
      payload: {
        simulatePickupPoints: true,
        validatedSession: {},
      },
    })

    expect(next.pickupPointsSimulation).toMatchObject({
      postalCode: null,
      country: null,
      geoCoordinates: null,
    })
  })
})
