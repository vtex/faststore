import type { GraphqlResolver } from '..'
import type { StoreImage, StoreProductImageArgs } from '../../..'
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

export const StoreProduct: Record<string, GraphqlResolver<Root>> & {
  offers: GraphqlResolver<
    Root,
    any,
    Array<EnhancedCommercialOffer<Root['sellers'][number], Root>>
  >

  isVariantOf: GraphqlResolver<Root, any, Root>

  image: GraphqlResolver<Root, any, StoreImage[]>
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
  breadcrumbList: async (root, _args, ctx) => {
    const {
      isVariantOf: {
        categories,
        productName,
        linkText,
        categoryId,
        categoriesIds,
        productId,
      },
      itemId,
    } = root

    const mainTreeIndex = findMainTreeIndex(categoriesIds, categoryId)
    const mainTree = categories[mainTreeIndex]
    const splittedCategories = removeTrailingSlashes(mainTree).split('/')

    const isLocalizationEnabled =
      (ctx.discoveryConfig as any)?.localization?.enabled === true
    const locale = ctx.storage.locale

    if (isLocalizationEnabled && locale) {
      // productTranslationsCache is request-scoped and shared with the slug and otherLocales
      // resolvers — if any of them already called getLocalizedProduct for this product+locale,
      // we reuse the result here at zero extra cost.
      const cacheKey = `${productId}:${locale}`
      let entry = ctx.storage.productTranslationsCache?.get(cacheKey)

      if (!entry) {
        try {
          const result = await ctx.clients.catalog.getLocalizedProduct(
            productId,
            locale
          )
          // Store both linkId (for the product item URL) and the full categories array
          // (for per-level localized slugs). We intentionally keep categories[] rather than
          // just the leaf category so we never need to reconstruct the hierarchy via split('/').
          entry = { linkId: result.linkId, categories: result.categories ?? [] }
          ctx.storage.productTranslationsCache ??= new Map()
          ctx.storage.productTranslationsCache.set(cacheKey, entry)
        } catch {
          // Catalog Dataplane API unavailable — fall through to IS-based behavior below
        }
      }

      if (entry) {
        // Extract the category IDs that belong to the main tree (same tree chosen from IS above).
        // A product can be registered in multiple trees; Catalog Dataplane returns all of them
        // in categories[], so we filter to only the ones matching this tree's IDs.
        const mainTreeIds = removeTrailingSlashes(categoriesIds[mainTreeIndex])
          .split('/')
          .filter(Boolean)

        const localizedCategories = entry.categories
          .filter((category) => mainTreeIds.includes(category.id.toString()))
          .sort(
            (a, b) =>
              a.fullPath.split('/').length - b.fullPath.split('/').length
          )

        // Length guard: if Catalog Dataplane returns fewer categories than IS expects
        // (e.g. data inconsistency or empty categories), fall through to the IS fallback.
        if (localizedCategories.length === splittedCategories.length) {
          return {
            itemListElement: [
              // Category items: both name and slug come from Catalog Dataplane, ensuring
              // they are always consistent with each other for the requested locale.
              ...localizedCategories.map((category, index) => ({
                name: category.name,
                item: `/${category.fullPathUriName}/`,
                position: index + 1,
              })),
              {
                name: productName,
                item: getPath(entry.linkId, itemId),
                position: splittedCategories.length + 1,
              },
            ],
            numberOfItems: splittedCategories.length,
          }
        }
      }
    }

    // Fallback: localization disabled, Catalog Dataplane unavailable, or category count mismatch.
    // Builds paths by applying slugify() to the IS category names, which mirrors the behaviour
    // of the VTEX Rewriter for default-locale slugs.
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
  gtin: ({ ean, referenceId }) => (ean ? ean : (referenceId[0]?.Value ?? '')),
  mpn: ({ isVariantOf: { manufacturerCode } }) => manufacturerCode ?? '',
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
  deliveryPromiseBadges: ({ isVariantOf: { deliveryPromisesBadges } }) =>
    deliveryPromisesBadges,
  otherLocales: async (root, _args, ctx) => {
    const isLocalizationEnabled =
      (ctx.discoveryConfig as any)?.localization?.enabled === true

    if (!isLocalizationEnabled) return null

    const configuredLocales = Object.keys(
      (ctx.discoveryConfig as any)?.localization?.locales ?? {}
    )

    if (configuredLocales.length === 0) return null

    const productId = root.isVariantOf.productId
    const itemId = root.itemId

    const results = await Promise.all(
      configuredLocales.map(async (locale) => {
        const cacheKey = `${productId}:${locale}`
        let entry = ctx.storage.productTranslationsCache?.get(cacheKey)

        if (!entry) {
          try {
            const result = await ctx.clients.catalog.getLocalizedProduct(
              productId,
              locale
            )
            entry = {
              linkId: result.linkId,
              categories: result.categories ?? [],
            }
            ctx.storage.productTranslationsCache ??= new Map()
            ctx.storage.productTranslationsCache.set(cacheKey, entry)
          } catch {
            return null
          }
        }

        return { locale, linkId: entry.linkId }
      })
    )

    return results
      .filter(
        (e): e is { locale: string; linkId: string } =>
          e !== null && Boolean(e.linkId)
      )
      .map((e) => ({ locale: e.locale, slug: `${e.linkId}-${itemId}` }))
  },
}
