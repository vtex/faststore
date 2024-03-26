import { FACET_CROSS_SELLING_MAP } from '../../utils/facets'
import { fetchAPI } from '../fetch'

import type { PortalProduct } from './types/Product'
import type { Context, Options } from '../../index'
import type { Brand } from './types/Brand'
import type { CategoryTree } from './types/CategoryTree'
import type { OrderForm, OrderFormInputItem } from './types/OrderForm'
import type { PortalPagetype } from './types/Portal'
import type { Region, RegionInput } from './types/Region'
import type {
  Simulation,
  SimulationArgs,
  SimulationOptions,
} from './types/Simulation'
import type { Session } from './types/Session'
import type { Channel } from '../../utils/channel'
import type { SalesChannel } from './types/SalesChannel'
import { MasterDataResponse } from './types/Newsletter'
import type { Address, AddressInput } from './types/Address'
import { DeliveryMode, SelectedAddress } from './types/ShippingData'
import { getStoreCookie, getWithCookie } from '../../utils/cookies'

type ValueOf<T> = T extends Record<string, infer K> ? K : never

const BASE_INIT = {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
}

export const VtexCommerce = (
  { account, environment, incrementAddress, subDomainPrefix }: Options,
  ctx: Context
) => {
  const base = `https://${account}.${environment}.com.br`
  const storeCookies = getStoreCookie(ctx)
  const withCookie = getWithCookie(ctx)

  const selectedPrefix =
    subDomainPrefix
      .map((prefix) => prefix + '.')
      .find((prefix) => ctx.headers?.host?.includes(prefix)) || ''

  const forwardedHost = (
    new Headers(ctx.headers).get('x-forwarded-host') ??
    ctx.headers?.host ??
    ''
  ).replace(selectedPrefix, '')
  return {
    catalog: {
      salesChannel: (sc: string): Promise<SalesChannel> =>
        fetchAPI(
          `${base}/api/catalog_system/pub/saleschannel/${sc}`,
          undefined,
          { storeCookies }
        ),
      brand: {
        list: (): Promise<Brand[]> =>
          fetchAPI(`${base}/api/catalog_system/pub/brand/list`, undefined, {
            storeCookies,
          }),
      },
      category: {
        tree: (depth = 3): Promise<CategoryTree[]> =>
          fetchAPI(
            `${base}/api/catalog_system/pub/category/tree/${depth}`,
            undefined,
            { storeCookies }
          ),
      },
      portal: {
        pagetype: (slug: string): Promise<PortalPagetype> =>
          fetchAPI(
            `${base}/api/catalog_system/pub/portal/pagetype/${slug}`,
            undefined,
            { storeCookies }
          ),
      },
      products: {
        crossselling: ({
          type,
          productId,
          groupByProduct = true,
        }: {
          type: ValueOf<typeof FACET_CROSS_SELLING_MAP>
          productId: string
          groupByProduct?: boolean
        }): Promise<PortalProduct[]> => {
          const params = new URLSearchParams({
            sc: ctx.storage.channel.salesChannel,
            groupByProduct: groupByProduct.toString(),
          })

          return fetchAPI(
            `${base}/api/catalog_system/pub/products/crossselling/${type}/${productId}?${params}`,
            undefined,
            { storeCookies }
          )
        },
      },
    },
    checkout: {
      simulation: (
        args: SimulationArgs,
        { salesChannel }: SimulationOptions = ctx.storage.channel
      ): Promise<Simulation> => {
        const params = new URLSearchParams({
          sc: salesChannel,
        })

        const headers: HeadersInit = withCookie({
          'content-type': 'application/json',
          'X-FORWARDED-HOST': forwardedHost,
        })

        return fetchAPI(
          `${base}/api/checkout/pub/orderForms/simulation?${params.toString()}`,
          {
            ...BASE_INIT,
            headers,
            body: JSON.stringify(args),
          },
          { storeCookies }
        )
      },
      shippingData: (
        {
          id,
          index,
          deliveryMode,
          selectedAddresses,
        }: {
          id: string
          index: number
          deliveryMode?: DeliveryMode | null
          selectedAddresses: SelectedAddress[]
        },
        setDeliveryWindow?: boolean
      ): Promise<OrderForm> => {
        const deliveryWindow = setDeliveryWindow
          ? {
              startDateUtc: deliveryMode?.deliveryWindow?.startDate,
              endDateUtc: deliveryMode?.deliveryWindow?.endDate,
            }
          : null

        const mappedBody = {
          logisticsInfo: Array.from({ length: index }, (_, itemIndex) => ({
            itemIndex,
            selectedDeliveryChannel: deliveryMode?.deliveryChannel || null,
            selectedSla: deliveryMode?.deliveryMethod || null,
            deliveryWindow: deliveryWindow,
          })),
          selectedAddresses: selectedAddresses,
          clearAddressIfPostalCodeNotFound: incrementAddress,
        }

        const headers: HeadersInit = withCookie({
          'content-type': 'application/json',
          'X-FORWARDED-HOST': forwardedHost,
        })

        return fetchAPI(
          `${base}/api/checkout/pub/orderForm/${id}/attachments/shippingData`,
          {
            ...BASE_INIT,
            headers,
            body: JSON.stringify(mappedBody),
          },
          { storeCookies }
        )
      },
      orderForm: ({
        id,
        refreshOutdatedData = true,
        channel = ctx.storage.channel,
      }: {
        id: string
        refreshOutdatedData?: boolean
        channel?: Required<Channel>
      }): Promise<OrderForm> => {
        const { salesChannel } = channel
        const params = new URLSearchParams({
          refreshOutdatedData: refreshOutdatedData.toString(),
          sc: salesChannel,
        })

        const headers: HeadersInit = withCookie({
          'content-type': 'application/json',
          'X-FORWARDED-HOST': forwardedHost,
        })

        return fetchAPI(
          `${base}/api/checkout/pub/orderForm/${id}?${params.toString()}`,
          {
            ...BASE_INIT,
            headers,
          },
          { storeCookies }
        )
      },
      clearOrderFormMessages: ({ id }: { id: string }) => {
        const headers: HeadersInit = withCookie({
          'content-type': 'application/json',
          'X-FORWARDED-HOST': forwardedHost,
        })

        return fetchAPI(
          `${base}/api/checkout/pub/orderForm/${id}/messages/clear`,
          {
            ...BASE_INIT,
            headers,
            body: '{}',
          }
        )
      },
      updateOrderFormItems: ({
        id,
        orderItems,
        allowOutdatedData = 'paymentData',
        salesChannel = ctx.storage.channel.salesChannel,
        shouldSplitItem = true,
      }: {
        id: string
        orderItems: OrderFormInputItem[]
        allowOutdatedData?: 'paymentData'
        salesChannel?: string
        shouldSplitItem?: boolean | null
      }): Promise<OrderForm> => {
        const params = new URLSearchParams({
          allowOutdatedData,
          sc: salesChannel,
        })

        const headers: HeadersInit = withCookie({
          'content-type': 'application/json',
          'X-FORWARDED-HOST': forwardedHost,
        })

        return fetchAPI(
          `${base}/api/checkout/pub/orderForm/${id}/items?${params}`,
          {
            headers,
            body: JSON.stringify({
              orderItems,
              noSplitItem: !shouldSplitItem,
            }),
            method: 'PATCH',
          },
          { storeCookies }
        )
      },
      setCustomData: ({
        id,
        appId,
        key,
        value,
      }: {
        id: string
        appId: string
        key: string
        value: string
      }): Promise<OrderForm> => {
        const headers: HeadersInit = withCookie({
          'content-type': 'application/json',
          'X-FORWARDED-HOST': forwardedHost,
        })

        return fetchAPI(
          `${base}/api/checkout/pub/orderForm/${id}/customData/${appId}/${key}`,
          {
            headers,
            body: JSON.stringify({ value }),
            method: 'PUT',
          }
        )
      },
      region: async ({
        postalCode,
        geoCoordinates,
        country,
        salesChannel,
      }: RegionInput): Promise<Region[]> => {
        const params = new URLSearchParams({
          country: country,
          sc: salesChannel ?? '',
        })

        postalCode
          ? params.append('postalCode', postalCode)
          : params.append(
              'geoCoordinates',
              `${geoCoordinates?.longitude};${geoCoordinates?.latitude}`
            )

        const url = `${base}/api/checkout/pub/regions/?${params.toString()}`
        const headers: HeadersInit = withCookie({
          'content-type': 'application/json',
          'X-FORWARDED-HOST': forwardedHost,
        })

        return fetchAPI(
          url,
          {
            headers,
          },
          { storeCookies }
        )
      },
      address: async ({
        postalCode,
        country,
      }: AddressInput): Promise<Address> => {
        const headers: HeadersInit = withCookie({
          'content-type': 'application/json',
          'X-FORWARDED-HOST': forwardedHost,
        })

        return fetchAPI(
          `${base}/api/checkout/pub/postal-code/${country}/${postalCode}`,
          {
            headers,
          },
          { storeCookies }
        )
      },
    },
    session: (search: string): Promise<Session> => {
      const params = new URLSearchParams(search)

      params.set(
        'items',
        'profile.id,profile.email,profile.firstName,profile.lastName,store.channel,store.countryCode,store.cultureInfo,store.currencyCode,store.currencySymbol'
      )

      const headers: HeadersInit = withCookie({
        'content-type': 'application/json',
      })

      return fetchAPI(
        `${base}/api/sessions?${params.toString()}`,
        {
          method: 'POST',
          headers,
          body: '{}',
        },
        { storeCookies }
      )
    },
    subscribeToNewsletter: (data: {
      name: string
      email: string
    }): Promise<MasterDataResponse> => {
      return fetchAPI(
        `${base}/api/dataentities/NL/documents/`,
        {
          ...BASE_INIT,
          body: JSON.stringify({ ...data, isNewsletterOptIn: true }),
          method: 'PATCH',
        },
        { storeCookies }
      )
    },
  }
}
