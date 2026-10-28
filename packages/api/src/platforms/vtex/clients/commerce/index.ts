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
import { ShippingDataBody } from './types/ShippingData'
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
// instead of per instance, to avoid flooding the logs. The account comes from
// the store's API options, not from the request, so the set holds at most one
// entry per account the process is configured for (usually one). It's still
// capped, so it can't grow without bound if that ever changes.
const MAX_WARNED_NEWSLETTER_ACCOUNTS = 100
const accountsWarnedAboutAnonymousNewsletter = new Set<string>()

/** Test-only: forget which accounts were warned about the anonymous fallback. */
export const resetAnonymousNewsletterWarnings = () =>
  accountsWarnedAboutAnonymousNewsletter.clear()

const getHeader = (headers: Context['headers'] | undefined, name: string) => {
  const value: string | string[] | undefined = (headers as any)?.[name]

  return Array.isArray(value) ? value[0] : value
}

/**
 * Host the Checkout API uses as the domain of the cookies it sets. Checkout
 * only honors it for hosts registered in the account, so a forged value is
 * ignored there.
 */
const getForwardedHost = (headers: Context['headers'] | undefined) => {
  // Proxies may append values: "client, proxy". Only the first one is the store host.
  const host =
    getHeader(headers, 'x-forwarded-host')?.split(',')[0].trim() ||
    getHeader(headers, 'host') ||
    ''

  return host.trim().replace(/^www\./, '')
}

export const VtexCommerce = (
  { account, environment }: Options,
  ctx: Context
) => {
  const base = `https://${account}.${environment}.com.br`
  const storeCookies = getStoreCookie(ctx)
  const withCookie = getWithCookie(ctx)
  const forwardedHost = getForwardedHost(ctx.headers)

  // Checkout calls forward the shopper cookies and keep the cookies Checkout
  // sets (e.g. CheckoutOrderFormOwnership) so they can reach the browser.
  const checkoutHeaders = () =>
    withCookie({
      'content-type': 'application/json',
      'X-FORWARDED-HOST': forwardedHost,
    })

  return {
    catalog: {
      salesChannel: (sc: string): Promise<SalesChannel> =>
        fetchAPI(`${base}/api/catalog_system/pub/saleschannel/${sc}`),
      brand: {
        list: (): Promise<Brand[]> =>
          fetchAPI(`${base}/api/catalog_system/pub/brand/list`),
      },
      category: {
        tree: (depth = 3): Promise<CategoryTree[]> =>
          fetchAPI(`${base}/api/catalog_system/pub/category/tree/${depth}`),
      },
      portal: {
        pagetype: (slug: string): Promise<PortalPagetype> =>
          fetchAPI(`${base}/api/catalog_system/pub/portal/pagetype/${slug}`),
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
            `${base}/api/catalog_system/pub/products/crossselling/${type}/${productId}?${params}`
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

        return fetchAPI(
          `${base}/api/checkout/pub/orderForms/simulation?${params.toString()}`,
          {
            ...BASE_INIT,
            body: JSON.stringify(args),
          }
        )
      },
      shippingData: ({
        id,
        body,
      }: {
        id: string
        body: ShippingDataBody
      }): Promise<OrderForm> => {
        if (body.selectedAddresses) {
          body.selectedAddresses.forEach((address) => {
            if (address.geoCoordinates === null) {
              address.geoCoordinates = []
            }
          })
        }
        return fetchAPI(
          `${base}/api/checkout/pub/orderForm/${id}/attachments/shippingData`,
          {
            ...BASE_INIT,
            headers: checkoutHeaders(),
            body: JSON.stringify(body),
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

        return fetchAPI(
          `${base}/api/checkout/pub/orderForm/${id}?${params.toString()}`,
          {
            ...BASE_INIT,
            headers: checkoutHeaders(),
          },
          { storeCookies }
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

        return fetchAPI(
          `${base}/api/checkout/pub/orderForm/${id}/items?${params}`,
          {
            ...BASE_INIT,
            headers: checkoutHeaders(),
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
        return fetchAPI(
          `${base}/api/checkout/pub/orderForm/${id}/customData/${appId}/${key}`,
          {
            ...BASE_INIT,
            headers: checkoutHeaders(),
            body: JSON.stringify({ value }),
            method: 'PUT',
          },
          { storeCookies }
        )
      },
      region: async ({
        postalCode,
        country,
        salesChannel,
      }: RegionInput): Promise<Region> => {
        return fetchAPI(
          `${base}/api/checkout/pub/regions/?postalCode=${postalCode}&country=${country}&sc=${
            salesChannel ?? ''
          }`
        )
      },
      address: async ({
        postalCode,
        country,
      }: AddressInput): Promise<Address> => {
        return fetchAPI(
          `${base}/api/checkout/pub/postal-code/${country}/${postalCode}`
        )
      },
    },
    session: (search: string): Promise<Session> => {
      const params = new URLSearchParams(search)

      params.set(
        'items',
        'profile.id,profile.email,profile.firstName,profile.lastName,store.channel,store.countryCode,store.cultureInfo,store.currencyCode,store.currencySymbol'
      )
      return fetchAPI(`${base}/api/sessions?${params.toString()}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          cookie: ctx.headers.cookie,
        },
        body: '{}',
      })
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
        if (
          accountsWarnedAboutAnonymousNewsletter.size >=
          MAX_WARNED_NEWSLETTER_ACCOUNTS
        ) {
          accountsWarnedAboutAnonymousNewsletter.clear()
        }
        accountsWarnedAboutAnonymousNewsletter.add(account)

        // Name only the missing variables, so a partial setup is easy to spot.
        const missing = [
          !appKey && 'FS_NEWSLETTER_APP_KEY',
          !appToken && 'FS_NEWSLETTER_APP_TOKEN',
        ].filter(Boolean)

        console.warn(
          `[subscribeToNewsletter] ${missing.join(' and ')} ${
            missing.length > 1 ? 'are' : 'is'
          } not set. Falling back to an anonymous Master Data request, which requires public fields in the NL entity. Configure both credentials and make the NL fields private.`
        )
      }

      return fetchAPI(`${base}/api/dataentities/NL/documents/`, {
        ...BASE_INIT,
        body,
        method: 'PATCH',
      })
    },
  }
}
