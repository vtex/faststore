import { canonicalFromProduct } from '../utils/canonical'
import { enhanceCommercialOffer } from '../utils/enhanceCommercialOffer'
import { bestOfferFirst } from '../utils/productStock'
import { slugify } from '../utils/slugify'
import type { EnhancedCommercialOffer } from '../utils/enhanceCommercialOffer'
import type { Resolver } from '..'
import type { PromiseType } from '../../../typings'
import type { Query } from './query'
import {
  attachmentToPropertyValue,
  attributeToPropertyValue,
  VALUE_REFERENCES,
} from '../utils/propertyValue'
import type { Attachment } from '../clients/commerce/types/OrderForm'
import { StoreImage, StoreProductImageArgs } from '../../..'

type QueryProduct = PromiseType<ReturnType<typeof Query.product>>

export type Root = QueryProduct & {
  attachmentsValues?: Attachment[]
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
    title: isVariantOf.productName,
    description: isVariantOf.description,
    canonical: canonicalFromProduct(isVariantOf),
  }),
  brand: ({ isVariantOf: { brand } }) => ({ name: brand }),
  breadcrumbList: ({
    isVariantOf: { categories, productName, linkText },
    itemId,
  }) => {
    return {
      itemListElement: [
        ...categories.reverse().map((categoryPath, index) => {
          const splitted = categoryPath.split('/')
          const name = splitted[splitted.length - 2]
          const item = splitted.map(slugify).join('/')

          return {
            name,
            item,
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
  image: ({ images }, args) => {
    const resolvedImages = (nonEmptyArray(images) ?? [DEFAULT_IMAGE]).map(
      ({ imageUrl, imageText, imageLabel }) => ({
        alternateName: imageText ?? '',
        url: imageUrl.replace('vteximg.com.br', 'vtexassets.com'),
        keywords: imageLabel,
      })
    )

    if(typeof args !== 'object') {
      return resolvedImages;
    }

    let { context, limit } = args as StoreProductImageArgs

    const shouldFilter = context !== "generic"

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
  releaseDate: ({ isVariantOf: { releaseDate } }) => releaseDate ?? '',
}
