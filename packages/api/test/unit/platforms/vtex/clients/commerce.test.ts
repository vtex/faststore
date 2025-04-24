import {
  type Options,
  getContextFactory,
} from '../../../../../src/platforms/vtex'
import * as clients from '../../../../../src/platforms/vtex/clients'
import type { Clients } from '../../../../../src/platforms/vtex/clients'

const apiOptions = {
  platform: 'vtex',
  account: 'storeframework',
  environment: 'vtexcommercestable',
  channel: '{"salesChannel":"1"}',
  locale: 'en-US',
  subDomainPrefix: ['www'],
  hideUnavailableItems: false,
  incrementAddress: false,
  flags: {
    enableOrderFormSync: true,
  },
} as Options

const contextFactory = getContextFactory(apiOptions)
const context = contextFactory({})
const getClients = clients.getClients

const pickupPointsMocked = jest.fn()

jest
  .spyOn(clients, 'getClients')
  .mockImplementation((options, context): Clients => {
    const otherClients = getClients(options, context)

    return {
      ...otherClients,
      commerce: {
        ...otherClients.commerce,
        checkout: {
          ...otherClients.commerce.checkout,
          pickupPoints: pickupPointsMocked,
        },
      },
    }
  })

describe('VTEX Commerce', () => {
  describe('Checkout', () => {
    describe('Pickup points', () => {
      it('should succeed with valid geo coordinates', async () => {
        const geoCoordinates = {
          latitude: 123,
          longitude: 456,
        }

        pickupPointsMocked.mockResolvedValueOnce({ paging: {}, items: [] })

        const { commerce } = clients.getClients(apiOptions, context)

        const result = await commerce.checkout.pickupPoints({
          geoCoordinates,
        })

        expect(pickupPointsMocked).toHaveBeenCalledTimes(1)
        expect(pickupPointsMocked).toHaveBeenCalledWith({ geoCoordinates })
        expect(result).toEqual({ paging: {}, items: [] })
      })

      it('should succeed with valid postal code and country', async () => {
        const country = 'BRA'
        const postalCode = '123456'

        pickupPointsMocked.mockResolvedValueOnce({ paging: {}, items: [] })

        const { commerce } = clients.getClients(apiOptions, context)

        const result = await commerce.checkout.pickupPoints({
          country,
          postalCode,
        })

        expect(pickupPointsMocked).toHaveBeenCalledTimes(1)
        expect(pickupPointsMocked).toHaveBeenCalledWith({ postalCode, country })
        expect(result).toEqual({ paging: {}, items: [] })
      })

      it('should throw an error when no params', async () => {
        const errorMessage = 'Missing required parameters.'

        pickupPointsMocked.mockRejectedValueOnce(() => {
          throw new Error(errorMessage)
        })

        const { commerce } = clients.getClients(apiOptions, context)

        expect(pickupPointsMocked).not.toHaveBeenCalledWith()
        await expect(commerce.checkout.pickupPoints({})).rejects.toThrow(
          errorMessage
        )
      })
    })
  })
})
