import type {
  ProductSummary_ProductFragment,
  RecommendationProduct,
} from '@generated/graphql'

/**
 * Maps a VTEX `RecommendationProduct` into the `ProductSummary_ProductFragment`
 * shape consumed by the core `ProductCard` (src/components/product/ProductCard),
 * so recommendation shelves render identical cards to regular shelves.
 *
 * The card reads `offers`/`image`/`isVariantOf` to compute title, price and
 * discount, so we surface the default seller's commercial offer here.
 */
export function mapRecommendationToProductCard(
  product: RecommendationProduct
): ProductSummary_ProductFragment {
  const item = product.items?.[0]
  const image = item?.images?.[0]
  const seller =
    item?.sellers?.find((currentSeller) => currentSeller.sellerDefault) ??
    item?.sellers?.[0]
  const offer = seller?.commertialOffer

  const price = offer?.Price ?? 0
  const listPrice = offer?.ListPrice ?? 0
  const availableQuantity = offer?.AvailableQuantity ?? 0
  const availability =
    availableQuantity > 0
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock'

  const imageUrl = image?.imageUrl ?? ''
  const imageAlt = image?.imageText ?? product.productName ?? ''

  return {
    id: product.productId,
    sku: item?.itemId ?? product.productId,
    slug: product.linkText ?? '',
    name: item?.nameComplete ?? item?.name ?? product.productName ?? '',
    gtin: '',
    unitMultiplier: null,
    hasSpecifications: null,
    brand: { name: product.brand ?? '', brandName: product.brand ?? '' },
    isVariantOf: {
      name: product.productName ?? '',
      productGroupID: product.productId,
      skuVariants: null,
    },
    image: imageUrl ? [{ url: imageUrl, alternateName: imageAlt }] : [],
    offers: {
      lowPrice: price,
      lowPriceWithTaxes: price,
      offers: [
        {
          availability,
          price,
          listPrice,
          listPriceWithTaxes: listPrice,
          priceWithTaxes: price,
          quantity: availableQuantity,
          seller: { identifier: seller?.sellerId ?? '1' },
        },
      ],
    },
    additionalProperty: [],
    advertisement: null,
    deliveryPromiseBadges: [],
  }
}
