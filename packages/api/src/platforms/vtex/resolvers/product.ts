import type { Resolver } from '..'
import type { EnhancedSku } from '../utils/enhanceSku'

type Root = EnhancedSku

const DEFAULT_IMAGE = {
  name: 'image',
  value:
    'https://storecomponents.vtexassets.com/assets/faststore/images/image___117a6d3e229a96ad0e0d0876352566e2.svg',
}

const getSlug = (link: string, id: string) => `${link}-${id}`
const getPath = (link: string, id: string) => `/${getSlug(link, id)}/p`

export const StoreProduct: Record<string, Resolver<Root>> = {
  productID: ({ id }) => id,
  name: ({ isVariantOf, name }) => name ?? isVariantOf.name,
  slug: ({ isVariantOf: { link }, id }) => getSlug(link, id),
  description: ({ isVariantOf: { description } }) => description,
  seo: ({ isVariantOf: { name, description } }) => ({
    title: name,
    description,
  }),
  brand: ({ isVariantOf: { brand } }) => ({ name: brand }),
  breadcrumbList: ({ isVariantOf: { categoryTrees, name, link }, id }) => ({
    itemListElement: [
      ...categoryTrees.map(({ categoryNames }, index) => ({
        name: categoryNames[categoryNames.length - 1],
        item: `/${categoryNames.join('/').toLowerCase()}`,
        position: index + 1,
      })),
      {
        name,
        item: getPath(link, id),
        position: categoryTrees.length + 1,
      },
    ],
    numberOfItems: categoryTrees.length,
  }),
  image: ({ isVariantOf, images }) =>
    (images ?? isVariantOf.images ?? [DEFAULT_IMAGE]).map(
      ({ name, value }) => ({
        alternateName: name ?? '',
        url: value.replace('vteximg.com.br', 'vtexassets.com'),
      })
    ),
  sku: ({
    isVariantOf: {
      skus: [sku],
    },
  }) => sku.id,
  gtin: ({ reference }) => reference ?? '',
  review: () => [],
  aggregateRating: () => ({}),
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

    return { ...simulation, product }
  },
  isVariantOf: ({ isVariantOf }) => isVariantOf,
}
