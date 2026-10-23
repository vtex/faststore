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

// Accounts already warned that they rely on public `NL` fields. The commerce
// client is created per request, so the warning is kept once per account
// instead of per instance, to avoid flooding the logs.
const accountsWarnedAboutAnonymousNewsletter = new Set<string>()

/** Test-only: forget which accounts were warned about the anonymous fallback. */
export const resetAnonymousNewsletterWarnings = () =>
  accountsWarnedAboutAnonymousNewsletter.clear()

export const VtexCommerce = (
  { account, environment, incrementAddress }: Options,
  ctx: Context
) => {
  const base = `https://${account}.${environment}.com.br`
  const storeCookies = getStoreCookie(ctx)
  const withCookie = getWithCookie(ctx)
  // replacing www. only for testing while www.vtexfaststore.com is configured with www
  const forwardedHost = (
    new Headers(ctx.headers).get('x-forwarded-host') ??
    ctx.headers?.host ??
    ''
  ).replace('www.', '')

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
    /**
     * Creates a newsletter subscription in the `NL` Master Data entity.
     *
     * With `FS_NEWSLETTER_APP_KEY`/`FS_NEWSLETTER_APP_TOKEN` set, the document is
     * created with a `POST` authenticated by that dedicated key, so `NL` fields
     * can stay private. The request is create-only: the body is built here from
     * the validated fields and never carries a document id, so the caller can't
     * reach an existing record.
     *
     * Without the credentials, it falls back to the legacy anonymous `PATCH`,
     * which only works while `NL` fields are public.
     */
    subscribeToNewsletter: ({
      name,
      email,
    }: {
      name?: string
      email: string
    }): Promise<MasterDataResponse> => {
      const body = JSON.stringify({
        ...(name ? { name } : {}),
        email,
        isNewsletterOptIn: true,
      })
      const appKey = process.env.FS_NEWSLETTER_APP_KEY
      const appToken = process.env.FS_NEWSLETTER_APP_TOKEN

      if (appKey && appToken) {
        return fetchAPI(`${base}/api/dataentities/NL/documents`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            accept: 'application/json',
            'X-VTEX-API-AppKey': appKey,
            'X-VTEX-API-AppToken': appToken,
          },
          body,
        })
      }

      if (!accountsWarnedAboutAnonymousNewsletter.has(account)) {
        accountsWarnedAboutAnonymousNewsletter.add(account)
        console.warn(
          '[subscribeToNewsletter] FS_NEWSLETTER_APP_KEY/FS_NEWSLETTER_APP_TOKEN are not set. Falling back to an anonymous Master Data request, which requires public fields in the NL entity. Configure the credentials and make the NL fields private.'
        )
      }

      return fetchAPI(
        `${base}/api/dataentities/NL/documents/`,
        {
          ...BASE_INIT,
          body,
          method: 'PATCH',
        },
        { storeCookies }
      )
    },
  }
}
