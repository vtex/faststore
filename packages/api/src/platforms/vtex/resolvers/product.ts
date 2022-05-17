import { enhanceCommercialOffer } from '../utils/enhanceCommercialOffer'
import { bestOfferFirst } from '../utils/productStock'
import type { EnhancedCommercialOffer } from '../utils/enhanceCommercialOffer'
import type { Resolver } from '..'
import type { PromiseType } from '../../../typings'
import type { Query } from './query'
import { VALUE_REFERENCES } from '../utils/propertyValue'
import type { Attachment } from '../clients/commerce/types/OrderForm'

type QueryProduct = PromiseType<ReturnType<typeof Query.product>>

type Root = Omit<QueryProduct, 'attachments'> & {
  attachments: AttachmentDefinition[] | Attachment[]
}

type AttachmentDefinition = QueryProduct['attachments'][number]

const DEFAULT_IMAGE = {
  imageText: 'image',
  imageUrl:
    'https://storecomponents.vtexassets.com/assets/faststore/images/image___117a6d3e229a96ad0e0d0876352566e2.svg',
}

const getSlug = (link: string, id: string) => `${link}-${id}`
const getPath = (link: string, id: string) => `/${getSlug(link, id)}/p`
const nonEmptyArray = <T>(array: T[] | null | undefined) =>
  Array.isArray(array) && array.length > 0 ? array : null

const isAttachmentDefinition = (
  attachment: Root['attachments'][number]
): attachment is AttachmentDefinition => 'id' in attachment

export const StoreProduct: Record<string, Resolver<Root>> & {
  offers: Resolver<
    Root,
    any,
    Array<EnhancedCommercialOffer<Root['sellers'][number], Root>>
  >

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
  offers: (root) =>
    root.sellers
      .flatMap((seller) =>
        enhanceCommercialOffer({
          offer: seller.commertialOffer,
          seller,
          product: root,
        })
      )
      .sort(bestOfferFirst),
  isVariantOf: (root) => root,
  additionalProperty: ({ variations = [], attachments }) => {
    const propertyValueVariations = variations.flatMap(({ name, values }) =>
      values.map((value) => ({
        name,
        value,
        valueReference: VALUE_REFERENCES.variation,
      }))
    )

    // Typescript don't understand (A[] | B[]) as an array, only Array<A | B>
    const propertyValueAttachments = (attachments as Array<
      Root['attachments'][number]
    >)
      .map((attachment: Root['attachments'][number]) => {
        if (isAttachmentDefinition(attachment)) {
          return
        }

        return {
          name: attachment.name,
          value: attachment.content,
          valueReference: VALUE_REFERENCES.attachment,
        }
      })
      .filter(Boolean)

    return [...propertyValueVariations, ...propertyValueAttachments]
  },
}
