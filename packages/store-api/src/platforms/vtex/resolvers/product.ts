import type { Resolver } from '..'
import type { EnhancedSku } from '../utils/enhanceSku'

type Root = EnhancedSku

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
    (images ?? isVariantOf.images ?? []).map(({ name, value }) => ({
      alternateName: name ?? '',
      url: value.replace('vteximg.com.br', 'vtexassets.com'),
    })),
  sku: ({
    isVariantOf: {
      skus: [sku],
    },
  }) => sku.id,
  gtin: ({ reference }) => reference ?? '',
  review: () => [],
  aggregateRating: () => ({}),
  offers: async ({ sellers, id }, _, ctx) => {
    const {
      clients: { commerce },
    } = ctx

    // Unique seller ids
    const sellerIds = sellers.map((seller) => seller.id)
    const items = Array.from(new Set(sellerIds)).map((seller) => ({
      quantity: 1,
      seller,
      id,
    }))

    return commerce.checkout.simulation({
      items,
    })
  },
  isVariantOf: ({ isVariantOf }) => isVariantOf,
}
