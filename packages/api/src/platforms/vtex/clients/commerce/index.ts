import type { Context, Options } from '../../index'
import { fetchAPI } from '../fetch'
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

const BASE_INIT = {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
}

export const VtexCommerce = (
  { account, environment }: Options,
  ctx: Context
) => {
  const base = `https://${account}.${environment}.com.br`

  return {
    catalog: {
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
          BASE_INIT
        )
      },
      updateOrderFormItems: ({
        id,
        orderItems,
        allowOutdatedData = 'paymentData',
        salesChannel = ctx.storage.channel.salesChannel,
      }: {
        id: string
        orderItems: OrderFormInputItem[]
        allowOutdatedData?: 'paymentData'
        salesChannel?: string
      }): Promise<OrderForm> => {
        const params = new URLSearchParams({
          allowOutdatedData,
          sc: salesChannel,
        })

        return fetchAPI(
          `${base}/api/checkout/pub/orderForm/${id}/items?${params}`,
          {
            ...BASE_INIT,
            body: JSON.stringify({ orderItems }),
            method: 'PATCH',
          }
        )
      },
      addOffering: ({
        orderNumber,
        itemIndex,
        id,
      }: {
        orderNumber: string
        itemIndex: number
        id: string
      }) => {
        const data = {
          id,
          info: null,
        }

        return fetchAPI(
          `${base}/api/checkout/pub/orderForm/${orderNumber}/items/${itemIndex}/offerings`,
          {
            ...BASE_INIT,
            body: JSON.stringify(data),
            method: 'POST',
          }
        )
      },
      removeOffering: ({
        orderNumber,
        itemIndex,
        id,
      }: {
        orderNumber: string
        itemIndex: number
        id: string
      }) => {
        const data = {
          id,
          info: null,
        }

        return fetchAPI(
          `${base}/api/checkout/pub/orderForm/${orderNumber}/items/${itemIndex}/offerings/${id}/remove`,
          {
            ...BASE_INIT,
            body: JSON.stringify(data),
            method: 'POST',
          }
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
    },
    session: (): Promise<Session> =>
      fetchAPI(
        `${base}/api/sessions?items=profile.id,profile.email,profile.firstName,profile.lastName`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            cookie: ctx.headers.cookie,
          },
          body: '{}',
        }
      ),
  }
}
