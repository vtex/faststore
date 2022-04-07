import type { Resolver } from '..'
import { sortOfferByPrice } from '../utils/productStock'
import type { PromiseType } from '../../../typings'
import type { Query } from './query'
import type { Item } from '../clients/search/types/ProductSearchResult'
import type { EnhancedSku } from '../utils/enhanceSku'

type Root = PromiseType<ReturnType<typeof Query.product>>

const DEFAULT_IMAGE = {
  imageText: 'image',
  imageUrl:
    'https://storecomponents.vtexassets.com/assets/faststore/images/image___117a6d3e229a96ad0e0d0876352566e2.svg',
}

const getSlug = (link: string, id: string) => `${link}-${id}`
const getPath = (link: string, id: string) => `/${getSlug(link, id)}/p`
const nonEmptyArray = <T>(array: T[] | null | undefined) =>
  Array.isArray(array) && array.length > 0 ? array : null

export const StoreProduct: Record<string, Resolver<Root>> & {
  offers: Resolver<Root, any, Promise<{ items: Item[]; product: EnhancedSku }>>
  isVariantOf: Resolver<Root, any, Root>
} = {
  productID: ({ itemId }) => itemId,
  name: ({ isVariantOf, name }) => name ?? isVariantOf.productName,
  slug: ({ isVariantOf: { linkText }, itemId }) => getSlug(linkText, itemId),
  description: ({ isVariantOf: { description } }) => description,
  seo: ({ isVariantOf: { description, productName } }) => ({
    title: productName,
    description,
  }),
  brand: ({ isVariantOf: { brand } }) => ({ name: brand }),
  breadcrumbList: ({
    isVariantOf: { categories, productName, linkText },
    itemId,
  }) => {
    return {
      itemListElement: [
        ...categories.reverse().map((categoryPath, index) => {
          const categoryNames = categoryPath.split('/')

          return {
            name: categoryNames[categoryNames.length - 2],
            item: categoryPath.toLowerCase(),
            position: index + 1,
          }
        }),
        {
          name: productName,
          item: getPath(linkText, itemId),
          position: categories.length + 1,
        },
      ],
      numberOfItems: categories.length,
    }
  },
  image: ({ images }) =>
    (nonEmptyArray(images) ?? [DEFAULT_IMAGE]).map(
      ({ imageUrl, imageText }) => ({
        alternateName: imageText ?? '',
        url: imageUrl.replace('vteximg.com.br', 'vtexassets.com'),
      })
    ),
  sku: ({ itemId }) => itemId,
  gtin: ({ referenceId }) => referenceId[0]?.Value ?? '',
  review: () => [],
  aggregateRating: () => ({}),
  offers: async (
    product,
    _,
    ctx
  ): Promise<{ items: Item[]; product: Root }> => {
    const {
      storage: { channel },
    } = ctx

    const { itemId, sellers } = product

    const sellerFromChannel = sellers.find(
      (seller) => seller.sellerId === channel.salesChannel
    )

    if (sellerFromChannel === null || sellerFromChannel === undefined) {
      // This error will likely happen when you forget to forward the channel somewhere in your code.
      // Make sure all queries that lead to a product are forwarding the channel in context corectly
      throw new Error(
        `Product with id ${itemId} has no sellers for sales channel ${channel.salesChannel}.`
      )
    }

    return {
      items: sortOfferByPrice(product.isVariantOf.items),
      product,
    }
  },
  isVariantOf: (root) => root,
  // TODO: get this value. Fix any type
  additionalProperty: ({ attributes = [] }: any) =>
    attributes.map((attribute: any) => ({
      name: attribute.key,
      value: attribute.value,
    })),
}
