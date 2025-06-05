import { parse } from 'cookie'
import type { FACET_CROSS_SELLING_MAP } from '../../utils/facets'
import { fetchAPI } from '../fetch'

import type {
  IUserOrderCancel,
  QueryListUserOrdersArgs,
  StoreMarketingData,
  UserOrder,
  UserOrderCancel,
  UserOrderListResult,
} from '../../../..'
import type { Context, Options } from '../../index'
import type { Channel } from '../../utils/channel'
import {
  getStoreCookie,
  getWithAutCookie,
  getWithCookie,
} from '../../utils/cookies'
import type { ContractResponse } from './Contract'
import type { Address, AddressInput } from './types/Address'
import type { Brand } from './types/Brand'
import type { CategoryTree } from './types/CategoryTree'
import type { MasterDataResponse } from './types/Newsletter'
import type { OrderForm, OrderFormInputItem } from './types/OrderForm'
import type { PortalPagetype } from './types/Portal'
import type { PortalProduct } from './types/Product'
import type { Region, RegionInput } from './types/Region'
import type { SalesChannel } from './types/SalesChannel'
import type { Session } from './types/Session'
import type { DeliveryMode, SelectedAddress } from './types/ShippingData'
import type {
  Simulation,
  SimulationArgs,
  SimulationOptions,
} from './types/Simulation'
import type { PickupPointsInput, PickupPoints } from './types/PickupPoints'
import type { ScopesByUnit, UnitResponse } from './types/Unit'
import type { VtexIdResponse } from './types/VtexId'

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
  const withAutCookie = getWithAutCookie(ctx)

  const host =
    new Headers(ctx.headers).get('x-forwarded-host') ?? ctx.headers?.host ?? ''

  const selectedPrefix = subDomainPrefix
    ? subDomainPrefix
        .map((prefix) => prefix + '.')
        .find((prefix) => host.includes(prefix)) || ''
    : ''

  const forwardedHost = host.replace(selectedPrefix, '')

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
      marketingData: ({
        id,
        marketingData,
      }: {
        id: string
        marketingData: StoreMarketingData
      }): Promise<OrderForm> => {
        const headers: HeadersInit = withCookie({
          'content-type': 'application/json',
          'X-FORWARDED-HOST': forwardedHost,
        })

        return fetchAPI(
          `${base}/api/checkout/pub/orderForm/${id}/attachments/marketingData`,
          {
            headers,
            body: JSON.stringify(marketingData),
            method: 'POST',
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
      pickupPoints: ({
        geoCoordinates,
        postalCode,
        country,
      }: PickupPointsInput): Promise<PickupPoints> => {
        if (!geoCoordinates && (!postalCode || !country)) {
          throw new Error(
            'Missing required parameters for listing pickup points.'
          )
        }

        const headers: HeadersInit = withCookie({
          'content-type': 'application/json',
          'X-FORWARDED-HOST': forwardedHost,
        })
        const params = new URLSearchParams()

        if (geoCoordinates) {
          params.append(
            'geoCoordinates',
            `${geoCoordinates.longitude};${geoCoordinates.latitude}`
          )
        } else {
          params.append('countryCode', country as string)
          params.append('postalCode', postalCode as string)
        }

        return fetchAPI(
          `${base}/api/checkout/pub/pickup-points?${params.toString()}`,
          { headers },
          { storeCookies }
        )
      },
      cancelOrder: ({
        orderId,
        customerEmail,
        reason,
      }: IUserOrderCancel): Promise<UserOrderCancel> | undefined => {
        const headers: HeadersInit = withCookie({
          'content-type': 'application/json',
          'X-FORWARDED-HOST': forwardedHost,
        })

        return fetchAPI(
          `${base}/api/checkout/pub/orders/${orderId}/user-cancel-request`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              customerEmail,
              reason,
            }),
          },
          {}
        )
      },
    },
    session: (search: string): Promise<Session> => {
      const params = new URLSearchParams(search)

      params.set(
        'items',
        'profile.id,profile.email,profile.firstName,profile.lastName,store.channel,store.countryCode,store.cultureInfo,store.currencyCode,store.currencySymbol,authentication.customerId,authentication.storeUserId,authentication.storeUserEmail,authentication.unitId,authentication.unitName,checkout.regionId,'
      )

      const headers: HeadersInit = withCookie({
        'content-type': 'application/json',
      })

      const sessionCookie = parse(ctx?.headers?.cookie ?? '')?.vtex_session

      return fetchAPI(
        `${base}/api/sessions?${params.toString()}`,
        {
          method: sessionCookie ? 'PATCH' : 'POST',
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
    profile: {
      addresses: async (userId: string): Promise<Record<string, string>> => {
        const headers: HeadersInit = withAutCookie(forwardedHost, account)

        return fetchAPI(
          `${base}/api/profile-system/pvt/profiles/${userId}/addresses`,
          { headers },
          { storeCookies }
        )
      },
    },
    oms: {
      userOrder: ({ orderId }: { orderId: string }): Promise<UserOrder> => {
        const headers: HeadersInit = withCookie({
          'content-type': 'application/json',
          'X-FORWARDED-HOST': forwardedHost,
        })

        return fetchAPI(
          `${base}/api/oms/user/orders/${orderId}`,
          {
            method: 'GET',
            headers,
          },
          { storeCookies }
        )
      },
      listUserOrders: ({
        page,
        status,
        dateInitial,
        dateFinal,
        text,
        clientEmail,
        perPage,
      }: QueryListUserOrdersArgs): Promise<UserOrderListResult> => {
        const params = new URLSearchParams()

        if (dateInitial) {
          const dateInitialTimestamp = new Date(dateInitial).setHours(
            0,
            0,
            0,
            0
          )
          dateInitial = new Date(dateInitialTimestamp).toISOString()
        }
        if (dateFinal) {
          const dateFinalTimestamp = new Date(dateFinal).setHours(
            23,
            59,
            59,
            999
          )
          dateFinal = new Date(dateFinalTimestamp).toISOString()
        }

        if (text) params.append('text', text)
        if (status && status.length > 0) {
          status.forEach((s) =>
            s && s.length > 0 ? params.append('status', s) : null
          )
        }

        if (dateInitial && dateFinal) {
          params.append(
            'creation_date',
            `creationDate:[${dateInitial} TO ${dateFinal}]`
          )
        } else if (dateInitial) {
          params.append('creation_date', `creationDate:[${dateInitial} TO *]`)
        } else if (dateFinal) {
          params.append('creation_date', `creationDate:[* TO ${dateFinal}]`)
        }

        if (clientEmail) params.append('clientEmail', clientEmail)
        if (page) params.append('page', page.toString())
        if (perPage) params.append('per_page', perPage.toString())

        const headers: HeadersInit = withCookie({
          'content-type': 'application/json',
          'X-FORWARDED-HOST': forwardedHost,
        })

        return fetchAPI(
          `${base}/api/oms/user/orders?${params.toString()}`,
          {
            method: 'GET',
            headers,
          },
          { storeCookies }
        )
      },
    },
    units: {
      getUnitByUserId: ({
        userId,
      }: { userId: string }): Promise<UnitResponse> => {
        const headers: HeadersInit = withAutCookie(forwardedHost, account)

        return fetchAPI(
          `${base}/api/units/v1/${userId}/unit`,
          {
            method: 'GET',
            headers,
          },
          {}
        )
      },
      getOrgUnitById: ({
        orgUnitId,
      }: { orgUnitId: string }): Promise<UnitResponse> => {
        const headers: HeadersInit = withAutCookie(forwardedHost, account)

        return fetchAPI(
          `${base}/api/units/v1/${orgUnitId}`,
          {
            method: 'GET',
            headers,
          },
          {}
        )
      },
      getScopesByOrgUnit: ({
        orgUnitId,
      }: { orgUnitId: string }): Promise<ScopesByUnit> => {
        const headers: HeadersInit = withAutCookie(forwardedHost, account)

        return fetchAPI(
          `${base}/api/units/v1/${orgUnitId}/scopes`,
          {
            method: 'GET',
            headers,
          },
          {}
        )
      },
    },
    licenseManager: {
      getUserById: ({
        userId,
      }: { userId: string }): Promise<{
        id: string
        name: string
        email: string
      }> => {
        const headers: HeadersInit = withAutCookie(forwardedHost, account)

        return fetchAPI(
          `${base}/api/license-manager/users/${userId}`,
          {
            method: 'GET',
            headers,
          },
          {}
        )
      },
    },
    masterData: {
      getContractById: ({
        contractId,
      }: { contractId: string }): Promise<ContractResponse> => {
        const headers: HeadersInit = withAutCookie(forwardedHost, account)

        return fetchAPI(
          `${base}/api/dataentities/CL/documents/${contractId}?_fields=_all`,
          {
            method: 'GET',
            headers,
          },
          {}
        )
      },
    },
    vtexid: {
      validate: (): Promise<VtexIdResponse> => {
        const headers: HeadersInit = withAutCookie(forwardedHost, account)

        return fetchAPI(
          `${base}/api/vtexid/credential/validate`,
          {
            headers,
            body: JSON.stringify({
              token: headers['VtexIdclientAutCookie'],
            }),
            method: 'POST',
          },
          { storeCookies }
        )
      },
    },
  }
}
