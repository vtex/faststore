import type { EnhancedSku } from '../utils/enhanceSku'
import type { Resolver } from '..'
import { sortOfferByPrice } from './aggregateOffer'

const DEFAULT_IMAGE = {
  name: 'image',
  value:
    'https://storecomponents.vtexassets.com/assets/faststore/images/image___117a6d3e229a96ad0e0d0876352566e2.svg',
}

const getSlug = (link: string, id: string) => `${link}-${id}`
const nonEmptyArray = <T>(array: T[] | null | undefined) =>
  Array.isArray(array) && array.length > 0 ? array : null

type Root = EnhancedSku

export const StoreCrossSelling: Record<string, Resolver<Root>> = {
  productID: ({ id }) => id,
  name: ({ isVariantOf, name }) => name ?? isVariantOf.name,
  slug: ({ isVariantOf: { link }, id }) => getSlug(link, id),
  brand: ({ isVariantOf: { brand } }) => ({ name: brand }),
  image: ({ isVariantOf, images }) =>
    (
      nonEmptyArray(images) ??
      nonEmptyArray(isVariantOf.images) ?? [DEFAULT_IMAGE]
    ).map(({ name, value }) => ({
      alternateName: name ?? '',
      url: value.replace('vteximg.com.br', 'vtexassets.com'),
    })),
  sku: ({ id }) => id,
  gtin: ({ reference }) => reference ?? '',
  offers: async (product, _, ctx) => {
    const {
      loaders: { simulationLoader },
      storage: { channel },
    } = ctx

    const { id, policies } = product
    const sellers = policies.find((policy) => policy.id === channel)?.sellers

    if (sellers == null) {
      // This error will likely happen when you forget to forward the channel somewhere in your code.
      // Make sure all queries that lead to a product are forwarding the channel in context corectly
      throw new Error(
        `Product with id ${id} has no sellers for channel ${channel}.`
      )
    }

    // Unique seller ids
    const sellerIds = sellers.map((seller) => seller.id)
    const items = Array.from(new Set(sellerIds)).map((seller) => ({
      quantity: 1,
      seller,
      id,
    }))

    const simulation = await simulationLoader.load(items)

    return {
      ...simulation,
      items: sortOfferByPrice(simulation.items),
      product,
    }
  },
  isVariantOf: ({ isVariantOf }) => isVariantOf,
  additionalProperty: ({ attributes = [] }) =>
    attributes.map((attribute) => ({
      name: attribute.key,
      value: attribute.value,
    })),
}
