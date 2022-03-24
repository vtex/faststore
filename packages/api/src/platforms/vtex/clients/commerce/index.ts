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
import type { WhoSawAlsoBought } from './types/WhoSawAlsoBought'
import type { Session } from './types/Session'

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
      whoSawAlsoBought: async (
        productId: string
      ): Promise<WhoSawAlsoBought[] | null> => {
        const products: any = await fetchAPI(
          `${base}/api/catalog_system/pub/products/crossselling/whosawalsobought/${productId}`
        )

        if (products[0]) {
          return products.map((product: any) => {
            return {
              name: product.productName,
              productID: product.items[0].itemId,
              id: `${product.items[0].itemId}:StoreProduct`,
              sku: product.items[0].itemId,
              slug: `${product.linkText}-${product.items[0].itemId}`,
              gtin: product.items[0].referenceId[0].Value,
              image: product.items[0].images.map((image: any) => {
                return {
                  url: image.imageUrl.replace(
                    'vteximg.com.br',
                    'vtexassets.com'
                  ),
                  alternateName: image.imageText,
                }
              }),
              brand: {
                name: product.brand,
              },
              isVariantOf: {
                name: product.productName,
                productGroupID: product.items[0].itemId,
                additionalProperty: product?.allSpecifications
                  ? product?.allSpecifications?.reduce(
                      (acc: any, curr: any) => {
                        const insideSpecifications = product[`${curr}`].map(
                          (specification: string) => {
                            return {
                              name: curr,
                              value: specification,
                            }
                          }
                        )

                        return [...acc, ...insideSpecifications]
                      },
                      []
                    )
                  : [],
              },
              offers: {
                lowPrice: product.items[0].sellers[0].commertialOffer.Price,
                offers: [
                  {
                    price: product.items[0].sellers[0].commertialOffer.Price,
                    listPrice:
                      product.items[0].sellers[0].commertialOffer.ListPrice,
                    quantity: 1,
                    seller: {
                      identifier: product.items[0].sellers[0].sellerId,
                    },
                  },
                ],
              },
            }
          })
        }

        return null
      },
    },
    checkout: {
      simulation: (
        args: SimulationArgs,
        { salesChannel }: SimulationOptions = {
          salesChannel: ctx.storage.channel,
        }
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
        salesChannel = ctx.storage.channel,
      }: {
        id: string
        refreshOutdatedData?: boolean
        salesChannel?: string
      }): Promise<OrderForm> => {
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
        salesChannel = ctx.storage.channel,
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
