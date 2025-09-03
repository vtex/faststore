import type { Resolver } from '..'
import type { StoreImage, StoreProductImageArgs } from '../../..'
import type { PromiseType } from '../../../typings'
import type { Attachment } from '../clients/commerce/types/OrderForm'
import { canonicalFromProduct } from '../utils/canonical'
import type { EnhancedCommercialOffer } from '../utils/enhanceCommercialOffer'
import { enhanceCommercialOffer } from '../utils/enhanceCommercialOffer'
import { bestOfferFirst } from '../utils/productStock'
import {
  attachmentToPropertyValue,
  attributeToPropertyValue,
  VALUE_REFERENCES,
} from '../utils/propertyValue'
import { slugify } from '../utils/slugify'
import type { Query } from './query'

type QueryProduct = PromiseType<ReturnType<typeof Query.product>>

export type Root = QueryProduct & {
  attachmentsValues?: Attachment[]
  unitMultiplier: number
}

const DEFAULT_IMAGE = {
  imageText: 'image',
  imageUrl:
    'https://storecomponents.vtexassets.com/assets/faststore/images/image___117a6d3e229a96ad0e0d0876352566e2.svg',
  imageLabel: 'label',
}

const getSlug = (link: string, id: string) => `${link}-${id}`
const getPath = (link: string, id: string) => `/${getSlug(link, id)}/p`
const nonEmptyArray = <T>(array: T[] | null | undefined) =>
  Array.isArray(array) && array.length > 0 ? array : null

function removeTrailingSlashes(path: string) {
  return path.replace(/^\/+|\/+$/g, '')
}

/**
 * Finds the index of the main category tree that matches the given category ID.
 * This avoids including similar categories in the breadcrumb list.
 * If Intelligent Search starts providing the list without similar categories, we'll have direct access to the main tree
 * and we won't need this logic. Hopefully in the future we can remove this.
 *
 * @param categoriesIds - An array of category IDs representing different category trees.
 * @param categoryId - The category ID to find within the category trees.
 * @returns The index of the main category tree that contains the given category ID.
 *          If the category ID is not found, returns 0 - it should always be found, but the fallback was added for safety.
 */
const findMainTreeIndex = (categoriesIds: string[], categoryId: string) => {
  const mainTreeIndex = categoriesIds.findIndex((idsTree) => {
    const lastId = removeTrailingSlashes(idsTree).split('/').at(-1)
    return lastId === categoryId
  })
  return mainTreeIndex < 0 ? 0 : mainTreeIndex
}

export const StoreProduct: Record<string, Resolver<Root>> & {
  offers: Resolver<
    Root,
    any,
    Array<EnhancedCommercialOffer<Root['sellers'][number], Root>>
  >

  isVariantOf: Resolver<Root, any, Root>

  image: Resolver<Root, any, StoreImage[]>
} = {
  productID: ({ itemId }) => itemId,
  name: ({ isVariantOf, name }) => name ?? isVariantOf.productName,
  slug: ({ isVariantOf: { linkText }, itemId }) => getSlug(linkText, itemId),
  description: ({ isVariantOf: { description } }) => description,
  seo: ({ isVariantOf }) => ({
    title: isVariantOf.productTitle || isVariantOf.productName,
    description: isVariantOf.metaTagDescription || isVariantOf.description,
    canonical: canonicalFromProduct(isVariantOf),
  }),
  brand: ({ isVariantOf: { brand } }) => ({ name: brand }),
  unitMultiplier: ({ unitMultiplier }) => unitMultiplier,
  breadcrumbList: ({
    isVariantOf: {
      categories,
      productName,
      linkText,
      categoryId,
      categoriesIds,
    },
    itemId,
  }) => {
    const mainTreeIndex = findMainTreeIndex(categoriesIds, categoryId)
    const mainTree = categories[mainTreeIndex]
    const splittedCategories = removeTrailingSlashes(mainTree).split('/')

    return {
      itemListElement: [
        ...splittedCategories.map((name, index) => {
          const item = `/${splittedCategories
            .slice(0, index + 1)
            .map(slugify)
            .join('/')}/`
          return {
            name,
            item,
            position: index + 1,
          }
        }),
        {
          name: productName,
          item: getPath(linkText, itemId),
          position: splittedCategories.length + 1,
        },
      ],
      numberOfItems: splittedCategories.length,
    }
  },
  image: ({ images }, args) => {
    const resolvedImages = (nonEmptyArray(images) ?? [DEFAULT_IMAGE]).map(
      ({ imageUrl, imageText, imageLabel }) => ({
        alternateName: imageText ?? '',
        url: imageUrl.replace('vteximg.com.br', 'vtexassets.com'),
        keywords: imageLabel,
      })
    )

    if (typeof args !== 'object') {
      return resolvedImages
    }

    let { context, limit } = args as StoreProductImageArgs

    const shouldFilter = context !== 'generic'

    // Normalize count to undefined as we want any negative value to always return the full list of images
    limit = limit || -1
    limit = limit <= -1 ? undefined : limit

    let filteredImages = shouldFilter
      ? resolvedImages.filter(
          ({ keywords: imageKeywords }) => imageKeywords === context
        )
      : resolvedImages

    filteredImages =
      filteredImages.length === 0 ? resolvedImages : filteredImages

    return filteredImages.slice(0, limit)
  },
  sku: ({ itemId }) => itemId,
  gtin: ({ referenceId }) => referenceId[0]?.Value ?? '',
  review: () => [],
  aggregateRating: () => ({}),
  offers: (root) =>
    root.sellers
      .map((seller) =>
        enhanceCommercialOffer({
          offer: seller.commertialOffer,
          seller,
          product: root,
        })
      )
      .sort(bestOfferFirst),
  isVariantOf: (root) => root,
  additionalProperty: ({
    // Search uses the name variations for specifications
    variations: specifications = [],
    attachmentsValues = [],
    attributes = [],
  }) => {
    const propertyValueSpecifications = specifications.flatMap(
      ({ name, values }) =>
        values.map((value) => ({
          name,
          value,
          valueReference: VALUE_REFERENCES.specification,
        }))
    )

    const propertyValueAttachments = attachmentsValues.map(
      attachmentToPropertyValue
    )

    const propertyValueAttributes = attributes.map(attributeToPropertyValue)

    return [
      ...propertyValueSpecifications,
      ...propertyValueAttachments,
      ...propertyValueAttributes,
    ]
  },
  hasSpecifications: ({ isVariantOf }) =>
    Boolean(isVariantOf.skuSpecifications?.length),
  skuSpecifications: ({ isVariantOf: { skuSpecifications } }) =>
    skuSpecifications ?? [],
  specificationGroups: ({ isVariantOf: { specificationGroups } }) =>
    specificationGroups,
  releaseDate: ({ isVariantOf: { releaseDate } }) => releaseDate ?? '',
  advertisement: ({ isVariantOf: { advertisement } }) => advertisement,
}
